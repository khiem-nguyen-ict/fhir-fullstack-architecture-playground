package com.example.patient;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.core.env.Environment;

@SpringBootApplication
public class PatientServiceApplication {

  public static void main(String[] args) {
    Environment env = ctx.getEnvironment();
    System.out.println("==== DEBUG DATASOURCE ====");
    System.out.println("spring.datasource.url = " + env.getProperty("spring.datasource.url"));
    System.out.println("SPRING_DATASOURCE_URL = " + System.getenv("SPRING_DATASOURCE_URL"));
    System.out.println("==========================");
    ConfigurableApplicationContext ctx = SpringApplication.run(PatientServiceApplication.class, args);
  }
}
