package ax.kl;

import ax.kl.common.Log4J;
import ax.kl.hbase.HBaseConnectionPool;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@SpringBootApplication
@EnableCaching
@EnableTransactionManagement
@MapperScan(basePackages = {"ax.kl.**.mapper"})
public class KlApplication {

	public static void main(String[] args) {
		//初始化系统日志

		Log4J.setLogger(args);

		SpringApplication.run(KlApplication.class, args);
		HBaseConnectionPool p = new HBaseConnectionPool(1, 10);


	}
}
