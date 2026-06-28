package com.example.patient.controller;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import com.example.patient.config.PaginationProperties;
import com.example.patient.dto.PagedResult;
import com.example.patient.dto.PatientRequest;
import com.example.patient.entity.Patient;
import com.example.patient.repository.PatientRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

import java.util.NoSuchElementException;

class PatientControllerTest {

    @Mock
    private PatientRepository repository;

    @Mock
    private PaginationProperties paginationProperties;

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
        when(repository.findAll(any(Specification.class), any(Pageable.class))).thenReturn(new PageImpl<>(Arrays.asList(patient)));
        when(paginationProperties.getDefaultPageSize()).thenReturn(10);
        when(paginationProperties.getMaxPageSize()).thenReturn(100);

        PagedResult<Patient> result = controller.listPatients(0, null, null, null, null, null, null);

        assertEquals(1, result.items().size());
        assertEquals(1, result.total());
        assertEquals(0, result.offset());
        assertEquals(1, result.limit());
    }

    @Test
    void testListPatientsWithLimit() {
        when(repository.findAll(any(Specification.class), any(Pageable.class))).thenReturn(new PageImpl<>(Arrays.asList(patient)));
        when(paginationProperties.getDefaultPageSize()).thenReturn(10);
        when(paginationProperties.getMaxPageSize()).thenReturn(100);

        PagedResult<Patient> result = controller.listPatients(0, 5, null, null, null, null, null);

        assertEquals(1, result.items().size());
        assertEquals(1, result.total());
        assertEquals(0, result.offset());
        assertEquals(1, result.limit());
    }

    @Test
    void testListPatientsGeneralSearchMatchesName() {
        Patient patient2 = new Patient("Jane", "Smith", "Female", LocalDate.of(1990, 5, 5), "098-765-4321", "jane.smith@example.com");
        patient2.setId(2L);
        when(repository.findAll(any(Specification.class), any(Pageable.class))).thenReturn(new PageImpl<>(Arrays.asList(patient2)));
        when(paginationProperties.getDefaultPageSize()).thenReturn(10);
        when(paginationProperties.getMaxPageSize()).thenReturn(100);

        PagedResult<Patient> result = controller.listPatients(0, 10, null, null, "jane", null, null);

        assertEquals(1, result.items().size());
        assertEquals(1, result.total());
        assertEquals(patient2, result.items().get(0));
    }

    @Test
    void testListPatientsGeneralSearchMatchesEmail() {
        when(repository.findAll(any(Specification.class), any(Pageable.class))).thenReturn(new PageImpl<>(Arrays.asList(patient)));
        when(paginationProperties.getDefaultPageSize()).thenReturn(10);
        when(paginationProperties.getMaxPageSize()).thenReturn(100);

        PagedResult<Patient> result = controller.listPatients(0, 10, null, null, "john.doe", null, null);

        assertEquals(1, result.items().size());
        assertEquals(1, result.total());
        assertEquals(patient, result.items().get(0));
    }

    @Test
    void testListPatientsGeneralSearchMatchesBirthDate() {
        Patient patient2 = new Patient("Bob", "Jones", "Male", LocalDate.of(1985, 3, 10), "111-222-3333", "bob.jones@example.com");
        patient2.setId(2L);
        when(repository.findAll(any(Specification.class), any(Pageable.class))).thenReturn(new PageImpl<>(Arrays.asList(patient2)));
        when(paginationProperties.getDefaultPageSize()).thenReturn(10);
        when(paginationProperties.getMaxPageSize()).thenReturn(100);

        PagedResult<Patient> result = controller.listPatients(0, 10, null, null, "1985", null, null);

        assertEquals(1, result.items().size());
        assertEquals(1, result.total());
        assertEquals(patient2, result.items().get(0));
    }

    @Test
    void testListPatientsAdvancedSearchByField() {
        Patient patient2 = new Patient("Jane", "Smith", "Female", LocalDate.of(1990, 5, 5), "098-765-4321", "jane.smith@example.com");
        patient2.setId(2L);
        when(repository.findAll(any(Specification.class), any(Pageable.class))).thenReturn(new PageImpl<>(Arrays.asList(patient2)));
        when(paginationProperties.getDefaultPageSize()).thenReturn(10);
        when(paginationProperties.getMaxPageSize()).thenReturn(100);

        PagedResult<Patient> result = controller.listPatients(0, 10, null, null, null, Arrays.asList("email"), Arrays.asList("jane.smith@example.com"));

        assertEquals(1, result.items().size());
        assertEquals(1, result.total());
        assertEquals(patient2, result.items().get(0));
    }

    @Test
    void testListPatientsAdvancedSearchByGender() {
        Patient patient2 = new Patient("Jane", "Smith", "Female", LocalDate.of(1990, 5, 5), "098-765-4321", "jane.smith@example.com");
        patient2.setId(2L);
        when(repository.findAll(any(Specification.class), any(Pageable.class))).thenReturn(new PageImpl<>(Arrays.asList(patient2)));
        when(paginationProperties.getDefaultPageSize()).thenReturn(10);
        when(paginationProperties.getMaxPageSize()).thenReturn(100);

        PagedResult<Patient> result = controller.listPatients(0, 10, null, null, null, Arrays.asList("gender"), Arrays.asList("female"));

        assertEquals(1, result.items().size());
        assertEquals(1, result.total());
        assertEquals(patient2, result.items().get(0));
    }

    @Test
    void testListPatientsSearchNoMatches() {
        when(repository.findAll(any(Specification.class), any(Pageable.class))).thenReturn(new PageImpl<>(Arrays.asList()));
        when(paginationProperties.getDefaultPageSize()).thenReturn(10);
        when(paginationProperties.getMaxPageSize()).thenReturn(100);

        PagedResult<Patient> result = controller.listPatients(0, 10, null, null, "nonexistent", null, null);

        assertEquals(0, result.items().size());
        assertEquals(0, result.total());
    }

    @Test
    void testListPatientsClampsLimitToMax() {
        Patient patient2 = new Patient("Jane", "Smith", "Female", LocalDate.of(1990, 5, 5), "098-765-4321", "jane.smith@example.com");
        patient2.setId(2L);
        Patient patient3 = new Patient("Bob", "Jones", "Male", LocalDate.of(1985, 3, 10), "111-222-3333", "bob.jones@example.com");
        patient3.setId(3L);
        Patient patient4 = new Patient("Alice", "Brown", "Female", LocalDate.of(1992, 7, 15), "444-555-6666", "alice.brown@example.com");
        patient4.setId(4L);
        Patient patient5 = new Patient("Charlie", "Davis", "Male", LocalDate.of(1988, 9, 20), "777-888-9999", "charlie.davis@example.com");
        patient5.setId(5L);
        Patient patient6 = new Patient("Diana", "Wilson", "Female", LocalDate.of(1995, 11, 25), "000-111-2222", "diana.wilson@example.com");
        patient6.setId(6L);
        List<Patient> all = Arrays.asList(patient, patient2, patient3, patient4, patient5, patient6);
        when(repository.findAll(any(Specification.class), any(Pageable.class))).thenAnswer(invocation -> {
            Pageable pageable = invocation.getArgument(1);
            int pageSize = pageable.getPageSize();
            int page = pageable.getPageNumber();
            int from = page * pageSize;
            int to = Math.min(from + pageSize, all.size());
            return new PageImpl<>(all.subList(from, to), pageable, all.size());
        });
        when(paginationProperties.getDefaultPageSize()).thenReturn(10);
        when(paginationProperties.getMaxPageSize()).thenReturn(5);

        PagedResult<Patient> result = controller.listPatients(0, 20, null, null, null, null, null);

        assertEquals(5, result.items().size());
        assertEquals(5, result.limit());
        assertEquals(0, result.offset());
        assertEquals(6, result.total());
    }

    @Test
    void testListPatientsOffsetBeyondTotal() {
        when(repository.findAll(any(Specification.class), any(Pageable.class))).thenReturn(new PageImpl<>(Arrays.asList(), PageRequest.of(0, 5), 1));
        when(paginationProperties.getDefaultPageSize()).thenReturn(10);
        when(paginationProperties.getMaxPageSize()).thenReturn(100);

        PagedResult<Patient> result = controller.listPatients(10, 5, null, null, null, null, null);

        assertEquals(0, result.items().size());
        assertEquals(1, result.total());
        assertEquals(1, result.offset());
        assertEquals(0, result.limit());
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
        when(repository.findAll(any(Specification.class), any(Pageable.class))).thenReturn(new PageImpl<>(Arrays.asList(patient)));
        when(paginationProperties.getDefaultPageSize()).thenReturn(10);
        when(paginationProperties.getMaxPageSize()).thenReturn(100);

        Map<String, Object> bundle = controller.searchFhirPatients(0, 10, null);
        assertNotNull(bundle);
        assertTrue(bundle.containsKey("entry"));
        assertTrue(bundle.containsKey("link"));
    }

    @Test
    void testGetFhirPatient() {
        when(repository.findById(1L)).thenReturn(Optional.of(patient));
        Map<String, Object> fhirPatient = controller.getFhirPatient(1L);
        assertNotNull(fhirPatient);
        assertTrue(fhirPatient.containsKey("resourceType"));
        assertEquals("Patient", fhirPatient.get("resourceType"));
    }

    @Test
    void testHealth() {
        Map<String, Object> health = controller.health();
        assertEquals("UP", health.get("status"));
        assertEquals("patient-service", health.get("service"));
    }

    @Test
    void testGetPaginationConfig() {
        when(paginationProperties.getDefaultPageSize()).thenReturn(10);
        when(paginationProperties.getMaxPageSize()).thenReturn(100);

        Map<String, Object> config = controller.getPaginationConfig();
        assertEquals(10, config.get("defaultPageSize"));
        assertEquals(100, config.get("maxPageSize"));
    }

    @Test
    void testListPatientsSortByFullNameAsc() {
        when(repository.findAll(any(Specification.class), any(Pageable.class))).thenAnswer(invocation -> {
            Pageable pageable = invocation.getArgument(1);
            String sortStr = pageable.getSort().toString();
            assertTrue(sortStr.contains("givenName") && sortStr.contains("ASC"), "Sort should contain givenName ASC");
            assertTrue(sortStr.contains("familyName"), "Sort should contain familyName");
            return new PageImpl<>(Arrays.asList(patient));
        });
        when(paginationProperties.getDefaultPageSize()).thenReturn(10);
        when(paginationProperties.getMaxPageSize()).thenReturn(100);

        controller.listPatients(0, 10, "fullName", "asc", null, null, null);
    }

    @Test
    void testListPatientsSortByFullNameDesc() {
        when(repository.findAll(any(Specification.class), any(Pageable.class))).thenAnswer(invocation -> {
            Pageable pageable = invocation.getArgument(1);
            String sortStr = pageable.getSort().toString();
            assertTrue(sortStr.contains("givenName") && sortStr.contains("DESC"), "Sort should contain givenName DESC");
            assertTrue(sortStr.contains("familyName"), "Sort should contain familyName");
            return new PageImpl<>(Arrays.asList(patient));
        });
        when(paginationProperties.getDefaultPageSize()).thenReturn(10);
        when(paginationProperties.getMaxPageSize()).thenReturn(100);

        controller.listPatients(0, 10, "fullName", "desc", null, null, null);
    }
}
