package com.example.patient.mapper;

import static org.junit.jupiter.api.Assertions.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import com.example.patient.entity.Patient;
import org.junit.jupiter.api.Test;

class FhirMapperTest {

    @Test
    void testToFhirWithAllFields() {
        Patient patient = new Patient(
                "John", 
                "Doe", 
                "Male", 
                LocalDate.of(1980, 1, 1), 
                "123-456-7890", 
                "john.doe@example.com"
        );
        patient.setId(1L);

        Map<String, Object> fhirPatient = FhirMapper.toFhir(patient);

        assertEquals("Patient", fhirPatient.get("resourceType"));
        assertEquals("1", fhirPatient.get("id"));
        
        // Check name
        @SuppressWarnings("unchecked")
        List<Map<String, Object>> nameList = (List<Map<String, Object>>) fhirPatient.get("name");
        assertNotNull(nameList);
        assertEquals(1, nameList.size());
        
        Map<String, Object> name = nameList.get(0);
        assertEquals("official", name.get("use"));
        assertEquals("Doe", name.get("family"));
        @SuppressWarnings("unchecked")
        List<String> given = (List<String>) name.get("given");
        assertEquals(1, given.size());
        assertEquals("John", given.get(0));
        
        // Check gender
        assertEquals("Male", fhirPatient.get("gender"));
        
        // Check birthDate
        assertEquals("1980-01-01", fhirPatient.get("birthDate"));
        
        // Check telecom
        @SuppressWarnings("unchecked")
        List<Map<String, Object>> telecom = (List<Map<String, Object>>) fhirPatient.get("telecom");
        assertNotNull(telecom);
        assertEquals(2, telecom.size());
        
        // Find phone and email entries
        boolean foundPhone = false;
        boolean foundEmail = false;
        for (Map<String, Object> contactPoint : telecom) {
            if ("phone".equals(contactPoint.get("system")) && "123-456-7890".equals(contactPoint.get("value"))) {
                foundPhone = true;
            }
            if ("email".equals(contactPoint.get("system")) && "john.doe@example.com".equals(contactPoint.get("value"))) {
                foundEmail = true;
            }
        }
        assertTrue(foundPhone, "Phone contact point not found");
        assertTrue(foundEmail, "Email contact point not found");
    }

    @Test
    void testToFhirWithNullOptionalFields() {
        Patient patient = new Patient(
                "John", 
                "Doe", 
                null, 
                null, 
                null, 
                null
        );
        patient.setId(1L);

        Map<String, Object> fhirPatient = FhirMapper.toFhir(patient);

        assertEquals("Patient", fhirPatient.get("resourceType"));
        assertEquals("1", fhirPatient.get("id"));
        
        // Check name
        @SuppressWarnings("unchecked")
        List<Map<String, Object>> nameList = (List<Map<String, Object>>) fhirPatient.get("name");
        assertNotNull(nameList);
        assertEquals(1, nameList.size());
        
        Map<String, Object> name = nameList.get(0);
        assertEquals("official", name.get("use"));
        assertEquals("Doe", name.get("family"));
        @SuppressWarnings("unchecked")
        List<String> given = (List<String>) name.get("given");
        assertEquals(1, given.size());
        assertEquals("John", given.get(0));
        
        // Check that optional fields are not present
        assertFalse(fhirPatient.containsKey("gender"));
        assertFalse(fhirPatient.containsKey("birthDate"));
        assertFalse(fhirPatient.containsKey("telecom"));
    }

    @Test
    void testToFhirBundle() {
        Patient patient1 = new Patient(
                "John", 
                "Doe", 
                "Male", 
                LocalDate.of(1980, 1, 1), 
                "123-456-7890", 
                "john.doe@example.com"
        );
        patient1.setId(1L);
        
        Patient patient2 = new Patient(
                "Jane", 
                "Smith", 
                "Female", 
                LocalDate.of(1990, 5, 5), 
                "098-765-4321", 
                "jane.smith@example.com"
        );
        patient2.setId(2L);

        List<Patient> patients = List.of(patient1, patient2);
        Map<String, Object> bundle = FhirMapper.toFhirBundle(patients);

        assertEquals("Bundle", bundle.get("resourceType"));
        assertEquals("searchset", bundle.get("type"));
        assertEquals(2, bundle.get("total"));
        
        @SuppressWarnings("unchecked")
        List<Map<String, Object>> entries = (List<Map<String, Object>>) bundle.get("entry");
        assertNotNull(entries);
        assertEquals(2, entries.size());
        
        // Check first entry
        Map<String, Object> entry1 = entries.get(0);
        assertNotNull(entry1.get("resource"));
        @SuppressWarnings("unchecked")
        Map<String, Object> resource1 = (Map<String, Object>) entry1.get("resource");
        assertEquals("Patient", resource1.get("resourceType"));
        assertEquals("1", resource1.get("id"));
        
        // Check second entry
        Map<String, Object> entry2 = entries.get(1);
        assertNotNull(entry2.get("resource"));
        @SuppressWarnings("unchecked")
        Map<String, Object> resource2 = (Map<String, Object>) entry2.get("resource");
        assertEquals("Patient", resource2.get("resourceType"));
        assertEquals("2", resource2.get("id"));
    }

    @Test
    void testContactPoint() {
        // This tests the private method indirectly through toFhir, but we can also test it
        // by using reflection if needed. For now, we'll rely on the indirect test.
        // If we want to test it directly, we'd need to use reflection or make it package-private.
    }
}