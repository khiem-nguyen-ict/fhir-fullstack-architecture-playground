package com.example.patient;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.NoSuchElementException;

class PatientControllerTest {

    @Mock
    private PatientRepository repository;

    @InjectMocks
    private PatientController controller;

    private Patient patient;
    private PatientRequest request;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        patient = new Patient("John", "Doe", "Male", LocalDate.of(1980, 1, 1), "123-456-7890", "john.doe@example.com");
        patient.setId(1L);
        request = new PatientRequest();
        request.setGivenName("John");
        request.setFamilyName("Doe");
        request.setGender("Male");
        request.setBirthDate(LocalDate.of(1980, 1, 1));
        request.setPhone("123-456-7890");
        request.setEmail("john.doe@example.com");
    }

    @Test
    void testListPatients() {
        when(repository.findAll()).thenReturn(Arrays.asList(patient));
        List<Patient> patients = controller.listPatients();
        assertEquals(1, patients.size());
        assertEquals(patient, patients.get(0));
    }

    @Test
    void testGetPatientFound() {
        when(repository.findById(1L)).thenReturn(Optional.of(patient));
        Patient found = controller.getPatient(1L);
        assertEquals(patient, found);
    }

    @Test
    void testGetPatientNotFound() {
        when(repository.findById(1L)).thenReturn(Optional.empty());
        assertThrows(NoSuchElementException.class, () -> controller.getPatient(1L));
    }

    @Test
    void testCreatePatient() {
        when(repository.save(any(Patient.class))).thenReturn(patient);
        Patient created = controller.createPatient(request);
        assertEquals(patient.getGivenName(), created.getGivenName());
        assertEquals(patient.getFamilyName(), created.getFamilyName());
        verify(repository).save(any(Patient.class));
    }

    @Test
    void testUpdatePatient() {
        when(repository.findById(1L)).thenReturn(Optional.of(patient));
        when(repository.save(any(Patient.class))).thenReturn(patient);
        Patient updated = controller.updatePatient(1L, request);
        assertEquals(patient.getGivenName(), updated.getGivenName());
        verify(repository).save(any(Patient.class));
    }

    @Test
    void testDeletePatient() {
        doNothing().when(repository).deleteById(1L);
        controller.deletePatient(1L);
        verify(repository).deleteById(1L);
    }

    @Test
    void testSearchFhirPatients() {
        when(repository.findAll()).thenReturn(Arrays.asList(patient));
        Map<String, Object> bundle = controller.searchFhirPatients();
        assertNotNull(bundle);
        // We can check the structure of the bundle if needed, but for simplicity, we just check it's not null.
        // Alternatively, we can check that the bundle contains an entry.
        assertTrue(bundle.containsKey("entry"));
    }

    @Test
    void testGetFhirPatient() {
        when(repository.findById(1L)).thenReturn(Optional.of(patient));
        Map<String, Object> fhirPatient = controller.getFhirPatient(1L);
        assertNotNull(fhirPatient);
        // Check that it has the expected structure (e.g., contains "resourceType")
        assertTrue(fhirPatient.containsKey("resourceType"));
        assertEquals("Patient", fhirPatient.get("resourceType"));
    }

    @Test
    void testHealth() {
        Map<String, Object> health = controller.health();
        assertEquals("UP", health.get("status"));
        assertEquals("patient-service", health.get("service"));
    }

}