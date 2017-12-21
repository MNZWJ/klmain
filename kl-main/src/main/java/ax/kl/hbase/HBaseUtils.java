package ax.kl.hbase;

import java.io.IOException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.hbase.HBaseConfiguration;
import org.apache.hadoop.hbase.HColumnDescriptor;
import org.apache.hadoop.hbase.HTableDescriptor;
import org.apache.hadoop.hbase.TableName;
import org.apache.hadoop.hbase.client.Admin;
import org.apache.hadoop.hbase.client.Connection;
import org.apache.hadoop.hbase.client.ConnectionFactory;

public class HBaseUtils {

	private static Configuration conf = HBaseConfiguration.create();
	private static ExecutorService poolx = Executors.newFixedThreadPool(300);

	public static Connection getConnection() {
		conf.set("hbase.zookeeper.quorum","10.206.1.158");//hbase
		conf.set("hbase.zookeeper.property.clientPort","2181");
		int i = 0;
		Connection conn = null;
		do {
			try {
				conn = ConnectionFactory.createConnection(conf, poolx);
				if (conn != null) {
					break;
				}
				Thread.sleep(100);
				i++;
			} catch (InterruptedException e) {
				e.printStackTrace();
			} catch (IOException e) {
				e.printStackTrace();
			}
		} while (conn == null && i < 5);
		return conn;
	}

	public static Configuration getConfiguration(){
		return conf;
	}

	public static void closeConnection(Connection connection) {
		try {
			connection.close();
			poolx.shutdownNow();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
	
	
	/**
	 * ������
	 * @throws IOException
	 */
	public static void createTable(Connection connection, String tableName,
			String[] columns) throws IOException {
		Admin admin = null;
		try {
			admin = connection.getAdmin();
			TableName name = TableName.valueOf(tableName);
			if (admin.tableExists(name)) {
				admin.disableTable(name);
				admin.deleteTable(name);
			} else {
				HTableDescriptor desc = new HTableDescriptor();
				desc.setName(TableName.valueOf(tableName));
				for (String column : columns) {
					desc.addFamily(new HColumnDescriptor(column));
				}
				admin.createTable(desc);
			}
		} finally {
			admin.close();
		}
	}
	
	public static void main(String[] args) {
		String arrp[] = {"c1","c2"};
		try {
			createTable(getConnection(), "t2", arrp);
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	/**
	 * ��ҳ���������ݡ�<br>
	 * ������ڴ�����ʱΪ�˱�ָ���˷�Ĭ�ϵ������ռ䣬����ƴд�������ռ����ƣ���ʽΪ��namespace:tablename������
	 * 
	 * @param tableName
	 *            ������(*)��
	 * @param startRowKey
	 *            ��ʼ�м�(����Ϊ�գ����Ϊ�գ���ӱ��е�һ�п�ʼ����)��
	 * @param endRowKey
	 *            �����м�(����Ϊ��)��
	 * @param filterList
	 *            ������������������(��������ҳ������������Ϊ��)��
	 * @param maxVersions
	 *            ָ�����汾�������Ϊ�������ֵ����������а汾�����Ϊ��С����ֵ����������°汾������ֻ����ָ���İ汾������
	 * @param pageModel
	 *            ��ҳģ��(*)��
	 * @return ����HBasePageModel��ҳ����
	 */
	/*public static HBasePageModel scanResultByPageFilter(Connection connection,
			String tableName, byte[] startRowKey, byte[] endRowKey,
			FilterList filterList, int maxVersions, HBasePageModel pageModel) {
		if (pageModel == null) {
			pageModel = new HBasePageModel(10);
		}
		if (maxVersions <= 0) {
			// Ĭ��ֻ�������ݵ����°汾
			maxVersions = Integer.MIN_VALUE;
		}
		pageModel.initStartTime();
		pageModel.initEndTime();
		if (StringUtils.isBlank(tableName)) {
			return pageModel;
		}
		Table table = null;

		try {
			// ����HBase�����ƣ��õ�HTable����������õ��˱��߱����Լ�������һ������Ϣ�����ࡣ
			table = connection.getTable(TableName.valueOf(tableName));
			int tempPageSize = pageModel.getPageSize();
			boolean isEmptyStartRowKey = false;
			if (startRowKey == null) {
				// ���ȡ��ĵ�һ�м�¼�������õ��˱��߱����Լ�������һ�������ݲ����ࡣ
				Result firstResult = selectFirstResultRow(connection,
						tableName, filterList);
				if (firstResult.isEmpty()) {
					return pageModel;
				}
				startRowKey = firstResult.getRow();
			}
			if (pageModel.getPageStartRowKey() == null) {
				isEmptyStartRowKey = true;
				pageModel.setPageStartRowKey(startRowKey);
			} else {
				if (pageModel.getPageEndRowKey() != null) {
					pageModel.setPageStartRowKey(pageModel.getPageEndRowKey());
				}
				// �ӵڶ�ҳ��ʼ��ÿ�ζ���ȡһ����¼����Ϊ��һ����¼��Ҫɾ���ġ�
				tempPageSize += 1;
			}

			Scan scan = new Scan();
			scan.setStartRow(pageModel.getPageStartRowKey());
			if (endRowKey != null) {
				scan.setStopRow(endRowKey);
			}
			PageFilter pageFilter = new PageFilter(pageModel.getPageSize() + 1);
			if (filterList != null) {
				filterList.addFilter(pageFilter);
				scan.setFilter(filterList);
			} else {
				scan.setFilter(pageFilter);
			}
			if (maxVersions == Integer.MAX_VALUE) {
				scan.setMaxVersions();
			} else if (maxVersions == Integer.MIN_VALUE) {

			} else {
				scan.setMaxVersions(maxVersions);
			}
			ResultScanner scanner = table.getScanner(scan);
			List<Result> resultList = new ArrayList<Result>();
			int index = 0;
			for (Result rs : scanner.next(tempPageSize)) {
				if (isEmptyStartRowKey == false && index == 0) {
					index += 1;
					continue;
				}
				if (!rs.isEmpty()) {
					resultList.add(rs);
				}
				index += 1;
			}
			scanner.close();
			pageModel.setResultList(resultList);
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			try {
				if (table != null) {
					table.close();
				}
			} catch (IOException e) {
				e.printStackTrace();
			}
		}

		int pageIndex = pageModel.getPageIndex() + 1;
		pageModel.setPageIndex(pageIndex);
		if (pageModel.getResultList().size() > 0) {
			// ��ȡ���η�ҳ�������к�ĩ�е��м���Ϣ
			byte[] pageStartRowKey = pageModel.getResultList().get(0).getRow();
			byte[] pageEndRowKey = pageModel.getResultList()
					.get(pageModel.getResultList().size() - 1).getRow();
			pageModel.setPageStartRowKey(pageStartRowKey);
			pageModel.setPageEndRowKey(pageEndRowKey);
		}
		int queryTotalCount = pageModel.getQueryTotalCount()
				+ pageModel.getResultList().size();
		pageModel.setQueryTotalCount(queryTotalCount);
		pageModel.initEndTime();
		pageModel.printTimeInfo();
		return pageModel;
	}*/

}
