package ax.kl.hbase;

import org.apache.hadoop.hbase.client.Connection;

public class HBaseConnectionEntity {
	private String id;
	private Connection connection;
	private HBase_Connection_Status status;

	public Connection getConnection() {
		return connection;
	}

	public void setConnection(Connection connection) {
		this.connection = connection;
	}

	public HBase_Connection_Status getStatus() {
		return status;
	}

	public void setStatus(HBase_Connection_Status status) {
		this.status = status;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}
}
