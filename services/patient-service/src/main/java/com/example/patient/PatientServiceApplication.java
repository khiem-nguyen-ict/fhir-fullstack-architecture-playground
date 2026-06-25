package com.example.patient;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.core.env.Environment;

@SpringBootApplication
public class PatientServiceApplication {

  public static void main(String[] args) {
    System.out.println("==== RAW ENV ====");
    System.out.println("SPRING_DATASOURCE_URL=" + System.getenv("SPRING_DATASOURCE_URL"));
    System.out.println("=================");

    SpringApplication.run(PatientServiceApplication.class, args);
  }

  @Bean
  CommandLineRunner debugDatasource(Environment env) {
    return args -> {
      System.out.println("==== DEBUG DATASOURCE ====");
      System.out.println("spring.datasource.url = " + env.getProperty("spring.datasource.url"));
      System.out.println("SPRING_DATASOURCE_URL = " + System.getenv("SPRING_DATASOURCE_URL"));
      System.out.println("==========================");
    };
  }

}