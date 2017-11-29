package ax.kl;

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
		SpringApplication.run(KlApplication.class, args);
	}
}
