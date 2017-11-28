package com.example.tst;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@SpringBootApplication
@EnableCaching
@EnableTransactionManagement
@MapperScan(basePackages = {"com.example.tst.**.mapper"})
public class TstApplication {

	public static void main(String[] args) {
		SpringApplication.run(TstApplication.class, args);
	}
}
