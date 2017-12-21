package ax.kl.hbase;

import java.util.Iterator;
import java.util.Map.Entry;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

import org.apache.hadoop.hbase.client.Connection;

public class HBaseConnectionPool {
	protected static ConcurrentHashMap<String, HBaseConnectionEntity> idelConnections = null;
	protected static ConcurrentHashMap<String, HBaseConnectionEntity> activeConnections = null;
	protected static int initSize;
	protected static int maxSize;
	protected static AtomicInteger idelSize = new AtomicInteger(0);
	protected static AtomicInteger activeSize = new AtomicInteger(0);
	protected static HBaseConnectionPool instance = null;
	protected static Lock lock = new ReentrantLock();
	protected Object object = new Object();
	protected static volatile boolean isShutdown = false;

	/**
	 * 调用连接池时 HBaseConnectionEntity getConnection()
	 * @param args
	 */
//	public static void main(String[] args) {
//		HBaseConnectionPool p = new HBaseConnectionPool(1, 10);
//		p.getConnection();
//	}

	public HBaseConnectionPool(int initSize, int maxSize) {
		this.initSize = initSize;
		this.maxSize = maxSize;
		idelConnections = new ConcurrentHashMap<String, HBaseConnectionEntity>();
		activeConnections = new ConcurrentHashMap<String, HBaseConnectionEntity>();
		initConnections();
		new HBaseDetectFailConnection().start();
	}

	public HBaseConnectionEntity getConnection() {
		if (isShutdown) {
			throw new RuntimeException("pool is shutdown.");
		}
		lock.lock();
		try {
			if (idelSize.get() > 0) {
				if (idelConnections.size() <= 0) {
					throw new RuntimeException("");
				}
				Entry<String, HBaseConnectionEntity> entry = idelConnections
						.entrySet().iterator().next();
				String key = entry.getKey();
				HBaseConnectionEntity entity = entry.getValue();
				entity.setStatus(HBase_Connection_Status.active);
				idelConnections.remove(key);
				idelSize.decrementAndGet();
				if (entity.getConnection().isClosed()) {
					return getConnection();
				}
				activeConnections.put(key, entity);
				activeSize.incrementAndGet();
				return entity;
			}
		} finally {
			lock.unlock();
		}

		if (activeSize.get() > maxSize) {
			throw new RuntimeException("活跃数量大于最大值");
		}
		if (activeSize.get() >= maxSize) {
			synchronized (object) {
				try {
					object.wait();
				} catch (InterruptedException e) {
					e.printStackTrace();
				}
			}
			return getConnection();
		}

		if (isShutdown) {
			throw new RuntimeException("pool is shutdown.");
		}

		Connection conn = HBaseUtils.getConnection();
		String id = UUID.randomUUID().toString();
		HBaseConnectionEntity entity = new HBaseConnectionEntity();
		entity.setId(id);
		entity.setConnection(conn);
		entity.setStatus(HBase_Connection_Status.active);
		activeConnections.put(id, entity);
		activeSize.incrementAndGet();
		return entity;
	}

	private void initConnections() {
		for (int i = 0; i < this.initSize; i++) {
			HBaseConnectionEntity entity = new HBaseConnectionEntity();
			String id = UUID.randomUUID().toString();
			entity.setId(id);
			Connection conn = HBaseUtils.getConnection();
			if (conn == null) {
				continue;
			}
			entity.setConnection(conn);
			entity.setStatus(HBase_Connection_Status.idel);
			idelConnections.put(id, entity);
			idelSize.getAndAdd(1);
		}
	}

	public static HBaseConnectionPool getInstance() {
		if (isShutdown) {
			throw new RuntimeException("pool is already shutdown.");
		}
		if (instance != null) {
			return instance;
		}
		return getInstance(40, 40);
	}

	public static HBaseConnectionPool getInstance(int initSize, int maxSize) {
		if (isShutdown) {
			throw new RuntimeException("pool is already shutdown.");
		}
		if (initSize < 0 || maxSize < 1) {
			throw new RuntimeException("initSize必须不小于0，maxsize必须大于等于1");
		}
		if (initSize > maxSize) {
			initSize = maxSize;
		}
		synchronized (HBaseConnectionPool.class) {
			if (instance == null) {
				instance = new HBaseConnectionPool(initSize, maxSize);
			}
		}
		return instance;
	}

	public    void releaseConnection(String id) {
		if (isShutdown) {
			throw new RuntimeException("pool is shutdown.");
		}
		if (idelSize.get() == maxSize) {
			HBaseUtils.closeConnection(activeConnections.remove(id)
					.getConnection());
		} else {
			HBaseConnectionEntity entity = activeConnections.remove(id);
			entity.setStatus(HBase_Connection_Status.idel);
			idelConnections.put(id, entity);
			idelSize.incrementAndGet();
			activeSize.decrementAndGet();
			synchronized (object) {
				object.notify();
			}

		}
	}

	public void shutdown() {
		isShutdown = true;
		synchronized (object) {
			object.notifyAll();
		}
		Iterator<String> idelIt = idelConnections.keySet().iterator();
		while (idelIt.hasNext()) {
			String key = idelIt.next();
			HBaseConnectionEntity entity = idelConnections.get(key);
			HBaseUtils.closeConnection(entity.getConnection());
		}
		Iterator<String> activeIt = activeConnections.keySet().iterator();
		while (activeIt.hasNext()) {
			String key = activeIt.next();
			HBaseConnectionEntity entity = activeConnections.get(key);
			HBaseUtils.closeConnection(entity.getConnection());
		}
		initSize = 0;
		maxSize = 0;
		idelSize = new AtomicInteger(0);
		activeSize = new AtomicInteger(0);
	}

	public int getIdelSize() {
		return this.idelSize.get();
	}

	public int getActiveSize() {
		return this.activeSize.get();
	}

	/**
	 * 内部类
	 */
	class HBaseDetectFailConnection extends Thread {
		@Override
		public void run() {
			Iterator<String> itIdel = idelConnections.keySet().iterator();
			while (itIdel.hasNext()) {
				String key = itIdel.next();
				HBaseConnectionEntity entity = idelConnections.get(key);
				if (entity.getConnection().isClosed()) {
					idelConnections.remove(key);
					idelSize.decrementAndGet();
				}
			}

			Iterator<String> itActive = activeConnections.keySet().iterator();
			while (itActive.hasNext()) {
				String key = itActive.next();
				HBaseConnectionEntity entity = activeConnections.get(key);
				if (entity.getConnection().isClosed()) {
					activeConnections.remove(key);
					activeSize.decrementAndGet();
				}
			}
			try {
				Thread.sleep(10000);
			} catch (InterruptedException e) {
				e.printStackTrace();
			}
		}
	}
}
