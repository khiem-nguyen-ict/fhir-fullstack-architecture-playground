package com.example.patient.config;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import com.example.patient.entity.Patient;
import com.example.patient.repository.PatientRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

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
        when(repository.count()).thenReturn(1L);
        dataSeeder.run();
        verify(repository, never()).saveAll(any());
    }

    @Test
    void testRunWhenNoDataExists() {
        when(repository.count()).thenReturn(0L);
        dataSeeder.run();
        verify(repository, times(1)).saveAll(anyList());

        ArgumentCaptor<List<Patient>> captor = ArgumentCaptor.forClass(List.class);
        verify(repository).saveAll(captor.capture());
        assertEquals(300, captor.getValue().size());
    }

    @Test
    void testIsComponent() {
        Component component = DataSeeder.class.getAnnotation(Component.class);
        assertNotNull(component, "DataSeeder should be annotated with @Component");
    }

    @Test
    void testImplementsCommandLineRunner() {
        assertTrue(CommandLineRunner.class.isAssignableFrom(DataSeeder.class),
                "DataSeeder should implement CommandLineRunner");
    }
}
