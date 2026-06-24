package com.example.patient;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.time.LocalDate;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

class DataSeederTest {

    @Mock
    private PatientRepository repository;

    @InjectMocks
    private DataSeeder dataSeeder;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testRunWhenDataExists() {
        // Arrange
        when(repository.count()).thenReturn(1L); // Data already exists

        // Act
        dataSeeder.run();

        // Assert
        verify(repository, never()).save(any());
    }

    @Test
    void testRunWhenNoDataExists() {
        // Arrange
        when(repository.count()).thenReturn(0L); // No data exists

        // Act
        dataSeeder.run();

        // Assert
        verify(repository, times(3)).save(any(Patient.class));
        
        // Verify the specific patients were saved
        ArgumentCaptor<Patient> patientCaptor = ArgumentCaptor.forClass(Patient.class);
        verify(repository, times(3)).save(patientCaptor.capture());
        
        // Check that we have 3 patients
        assertEquals(3, patientCaptor.getAllValues().size());
        
        // We could check specific values here if needed, but for simplicity
        // we're just verifying that 3 save calls were made with Patient objects
    }

    @Test
    void testIsComponent() {
        // Verify that DataSeeder is annotated with @Component
        Component component = DataSeeder.class.getAnnotation(Component.class);
        assertNotNull(component, "DataSeeder should be annotated with @Component");
    }

    @Test
    void testImplementsCommandLineRunner() {
        // Verify that DataSeeder implements CommandLineRunner
        assertTrue(CommandLineRunner.class.isAssignableFrom(DataSeeder.class),
                "DataSeeder should implement CommandLineRunner");
    }
}