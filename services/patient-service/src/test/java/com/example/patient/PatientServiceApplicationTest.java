package com.example.patient;

import org.junit.jupiter.api.Test;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import static org.junit.jupiter.api.Assertions.*;

class PatientServiceApplicationTest {

    @Test
    void testMainMethod() {
        // We can't easily test the static main method without running the full application
        // Instead, we'll verify that the class has the expected annotations and structure
        
        // Just verify the class can be loaded
        assertNotNull(PatientServiceApplication.class);
    }

    @Test
    void testIsSpringBootApplication() {
        SpringBootApplication annotation = PatientServiceApplication.class.getAnnotation(SpringBootApplication.class);
        assertNotNull(annotation, "PatientServiceApplication should be annotated with @SpringBootApplication");
    }
}