package com.example.patient;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
@SpringBootApplication
public class PatientServiceApplication {

  public static void main(String[] args) {
    System.out.println("==== RAW ENV ====");
    System.out.println("SPRING_DATASOURCE_URL=" + System.getenv("SPRING_DATASOURCE_URL"));
    System.out.println("=================");

    SpringApplication.run(PatientServiceApplication.class, args);
  }

}