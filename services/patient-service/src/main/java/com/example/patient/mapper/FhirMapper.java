package com.example.patient.mapper;

import com.example.patient.entity.Patient;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Translates between the internal {@link Patient} JPA entity and a
 * minimal-but-valid FHIR R4 "Patient" resource representation.
 *
 * A real deployment would typically delegate this to a FHIR server
 * (e.g. HAPI FHIR) or the HAPI FHIR Structures library. To keep this
 * playground runnable without extra infrastructure, the mapping is
 * done by hand into a plain Map that serializes to the expected
 * FHIR JSON shape.
 */
public final class FhirMapper {

    private FhirMapper() {
    }

    public static Map<String, Object> toFhir(Patient patient) {
        Map<String, Object> resource = new LinkedHashMap<>();
        resource.put("resourceType", "Patient");
        resource.put("id", String.valueOf(patient.getId()));

        Map<String, Object> name = new LinkedHashMap<>();
        name.put("use", "official");
        name.put("family", patient.getFamilyName());
        name.put("given", List.of(patient.getGivenName()));
        resource.put("name", List.of(name));

        if (patient.getGender() != null) {
            resource.put("gender", patient.getGender());
        }
        if (patient.getBirthDate() != null) {
            resource.put("birthDate", patient.getBirthDate().toString());
        }

        List<Map<String, Object>> telecom = new ArrayList<>();
        if (patient.getPhone() != null && !patient.getPhone().isBlank()) {
            telecom.add(contactPoint("phone", patient.getPhone()));
        }
        if (patient.getEmail() != null && !patient.getEmail().isBlank()) {
            telecom.add(contactPoint("email", patient.getEmail()));
        }
        if (!telecom.isEmpty()) {
            resource.put("telecom", telecom);
        }

        return resource;
    }

    public static Map<String, Object> toFhirBundle(
            List<Patient> patients,
            int offset,
            int limit,
            long total,
            String baseUrl) {

        Map<String, Object> bundle = new LinkedHashMap<>();
        bundle.put("resourceType", "Bundle");
        bundle.put("type", "searchset");
        bundle.put("total", total);

        List<Map<String, Object>> entries = new ArrayList<>();
        for (Patient patient : patients) {
            Map<String, Object> entry = new LinkedHashMap<>();
            entry.put("resource", toFhir(patient));
            entries.add(entry);
        }
        bundle.put("entry", entries);

        List<Map<String, Object>> links = new ArrayList<>();
        links.add(link("self", baseUrl + "/fhir/Patient?_offset=" + offset + "&_count=" + limit));

        int firstOffset = 0;
        links.add(link("first", baseUrl + "/fhir/Patient?_offset=" + firstOffset + "&_count=" + limit));

        int lastOffset = (int) Math.max(0, total - limit);
        links.add(link("last", baseUrl + "/fhir/Patient?_offset=" + lastOffset + "&_count=" + limit));

        if (offset + limit < total) {
            int nextOffset = offset + limit;
            links.add(link("next", baseUrl + "/fhir/Patient?_offset=" + nextOffset + "&_count=" + limit));
        }

        if (offset > 0) {
            int prevOffset = Math.max(0, offset - limit);
            links.add(link("prev", baseUrl + "/fhir/Patient?_offset=" + prevOffset + "&_count=" + limit));
        }

        bundle.put("link", links);
        return bundle;
    }

    private static Map<String, Object> contactPoint(String system, String value) {
        Map<String, Object> contactPoint = new LinkedHashMap<>();
        contactPoint.put("system", system);
        contactPoint.put("value", value);
        return contactPoint;
    }

    private static Map<String, Object> link(String relation, String url) {
        Map<String, Object> link = new LinkedHashMap<>();
        link.put("relation", relation);
        link.put("url", url);
        return link;
    }
}
