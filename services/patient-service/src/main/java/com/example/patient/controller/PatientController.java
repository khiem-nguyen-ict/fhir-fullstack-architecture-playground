package com.example.patient.controller;

import com.example.patient.config.PaginationProperties;
import com.example.patient.dto.PagedResult;
import com.example.patient.entity.Patient;
import com.example.patient.dto.PatientRequest;
import com.example.patient.mapper.FhirMapper;
import com.example.patient.repository.PatientRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

/**
 * Patient Service REST API.
 *
 * Plain CRUD endpoints under /api/patients are used internally (and
 * directly testable via curl); /fhir/Patient endpoints return the
 * data shaped as FHIR R4 resources, which is what the GraphQL BFF
 * and any FHIR-aware client would consume.
 */
@RestController
public class PatientController {

    private final PatientRepository repository;
    private final PaginationProperties paginationProperties;

    public PatientController(PatientRepository repository, PaginationProperties paginationProperties) {
        this.repository = repository;
        this.paginationProperties = paginationProperties;
    }

    @GetMapping("/api/patients")
    public PagedResult<Patient> listPatients(
            @RequestParam(name = "offset", defaultValue = "0") int offset,
            @RequestParam(name = "limit", required = false) Integer limit,
            @RequestParam(name = "sortBy", required = false) String sortBy,
            @RequestParam(name = "sortDirection", required = false, defaultValue = "asc") String sortDirection) {

        int effectiveLimit = resolveLimit(limit);
        List<Patient> items = repository.findAll();
        long total = items.size();

        applySorting(items, sortBy, sortDirection);

        int fromIndex = Math.min(offset, (int) total);
        int toIndex = Math.min(fromIndex + effectiveLimit, (int) total);

        return new PagedResult<>(
                items.subList(fromIndex, toIndex),
                total,
                fromIndex,
                toIndex - fromIndex
        );
    }

    @GetMapping("/api/patients/{id}")
    public Patient getPatient(@PathVariable Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Patient " + id + " not found"));
    }

    @PostMapping("/api/patients")
    @ResponseStatus(HttpStatus.CREATED)
    public Patient createPatient(@Valid @RequestBody PatientRequest request) {
        Patient patient = new Patient(
                request.getGivenName(),
                request.getFamilyName(),
                request.getGender(),
                request.getBirthDate(),
                request.getPhone(),
                request.getEmail());
        return repository.save(patient);
    }

    @PutMapping("/api/patients/{id}")
    public Patient updatePatient(@PathVariable Long id, @Valid @RequestBody PatientRequest request) {
        Patient patient = repository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Patient " + id + " not found"));
        patient.setGivenName(request.getGivenName());
        patient.setFamilyName(request.getFamilyName());
        patient.setGender(request.getGender());
        patient.setBirthDate(request.getBirthDate());
        patient.setPhone(request.getPhone());
        patient.setEmail(request.getEmail());
        return repository.save(patient);
    }

    @DeleteMapping("/api/patients/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletePatient(@PathVariable Long id) {
        repository.deleteById(id);
    }

    @GetMapping("/api/config/pagination")
    public Map<String, Object> getPaginationConfig() {
        return Map.of(
                "defaultPageSize", paginationProperties.getDefaultPageSize(),
                "maxPageSize", paginationProperties.getMaxPageSize()
        );
    }

    // --- FHIR-shaped read endpoints, mirroring a real FHIR server's surface ---

    @GetMapping("/fhir/Patient")
    public Map<String, Object> searchFhirPatients(
            @RequestParam(name = "_offset", defaultValue = "0") int offset,
            @RequestParam(name = "_count", required = false) Integer count,
            @RequestHeader(value = "X-Forwarded-Prefix", required = false) String forwardedPrefix) {

        int effectiveLimit = resolveLimit(count);
        String baseUrl = buildBaseUrl(forwardedPrefix);

        List<Patient> all = repository.findAll();
        long total = all.size();

        int fromIndex = Math.min(offset, (int) total);
        int toIndex = Math.min(fromIndex + effectiveLimit, (int) total);
        List<Patient> page = all.subList(fromIndex, toIndex);

        return FhirMapper.toFhirBundle(page, fromIndex, effectiveLimit, total, baseUrl);
    }

    @GetMapping("/fhir/Patient/{id}")
    public Map<String, Object> getFhirPatient(@PathVariable Long id) {
        Patient patient = repository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Patient " + id + " not found"));
        return FhirMapper.toFhir(patient);
    }

    @GetMapping("/health")
    public Map<String, Object> health() {
        return Map.of("status", "UP", "service", "patient-service");
    }

    @ExceptionHandler(NoSuchElementException.class)
    public ResponseEntity<Map<String, Object>> handleNotFound(NoSuchElementException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", ex.getMessage()));
    }

    private int resolveLimit(Integer requested) {
        int max = paginationProperties.getMaxPageSize();
        if (requested == null || requested <= 0) {
            return paginationProperties.getDefaultPageSize();
        }
        return Math.min(requested, max);
    }

    private String buildBaseUrl(String forwardedPrefix) {
        String prefix = forwardedPrefix != null && !forwardedPrefix.isBlank() ? forwardedPrefix : "";
        String host = "http://localhost:8081";
        return prefix.isBlank() ? host : prefix;
    }

    private void applySorting(List<Patient> items, String sortBy, String sortDirection) {
        if (items == null || items.isEmpty() || sortBy == null || sortBy.isBlank()) {
            return;
        }

        boolean ascending = !"desc".equalsIgnoreCase(sortDirection);
        Comparator<Patient> comparator = switch (sortBy) {
            case "fullName" -> Comparator.comparing(
                    p -> (p.getGivenName() != null ? p.getGivenName() : "") + " " + (p.getFamilyName() != null ? p.getFamilyName() : "")
            );
            case "givenName" -> Comparator.comparing(p -> p.getGivenName() != null ? p.getGivenName() : "");
            case "familyName" -> Comparator.comparing(p -> p.getFamilyName() != null ? p.getFamilyName() : "");
            case "gender" -> Comparator.comparing(p -> p.getGender() != null ? p.getGender() : "");
            case "birthDate" -> Comparator.comparing(
                    p -> p.getBirthDate(),
                    Comparator.nullsFirst(Comparator.naturalOrder())
            );
            case "phone" -> Comparator.comparing(p -> p.getPhone() != null ? p.getPhone() : "");
            case "email" -> Comparator.comparing(p -> p.getEmail() != null ? p.getEmail() : "");
            default -> null;
        };

        if (comparator != null) {
            if (!ascending) {
                comparator = comparator.reversed();
            }
            items.sort(comparator);
        }
    }
}
