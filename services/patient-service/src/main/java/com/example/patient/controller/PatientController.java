package com.example.patient.controller;

import com.example.patient.config.PaginationProperties;
import com.example.patient.dto.PagedResult;
import com.example.patient.entity.Patient;
import com.example.patient.dto.PatientRequest;
import com.example.patient.mapper.FhirMapper;
import com.example.patient.repository.PatientRepository;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

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
            @RequestParam(name = "sortDirection", required = false, defaultValue = "asc") String sortDirection,
            @RequestParam(name = "search", required = false) String search,
            @RequestParam(name = "filterField", required = false) List<String> filterField,
            @RequestParam(name = "filterValue", required = false) List<String> filterValue) {

        Specification<Patient> spec = buildSpecification(search, filterField, filterValue);
        Sort sort = buildSort(sortBy, sortDirection);
        int effectiveLimit = resolveLimit(limit);
        int page = offset / effectiveLimit;
        Pageable pageable = PageRequest.of(page, effectiveLimit, sort);

        Page<Patient> patientPage = repository.findAll(spec, pageable);

        int fromIndex = Math.min(offset, (int) patientPage.getTotalElements());

        return new PagedResult<>(
                patientPage.getContent(),
                patientPage.getTotalElements(),
                fromIndex,
                patientPage.getContent().size()
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

    @GetMapping("/fhir/Patient")
    public Map<String, Object> searchFhirPatients(
            @RequestParam(name = "_offset", defaultValue = "0") int offset,
            @RequestParam(name = "_count", required = false) Integer count,
            @RequestHeader(value = "X-Forwarded-Prefix", required = false) String forwardedPrefix) {

        int effectiveLimit = resolveLimit(count);
        String baseUrl = buildBaseUrl(forwardedPrefix);
        Specification<Patient> spec = Specification.where(null);
        Sort sort = Sort.unsorted();
        int page = offset / effectiveLimit;
        Pageable pageable = PageRequest.of(page, effectiveLimit, sort);

        Page<Patient> patientPage = repository.findAll(spec, pageable);

        return FhirMapper.toFhirBundle(patientPage.getContent(), offset, effectiveLimit, patientPage.getTotalElements(), baseUrl);
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

    private Sort buildSort(String sortBy, String sortDirection) {
        if (sortBy == null || sortBy.isBlank()) {
            return Sort.unsorted();
        }

        Sort.Direction direction = "desc".equalsIgnoreCase(sortDirection) ? Sort.Direction.DESC : Sort.Direction.ASC;

        return switch (sortBy) {
            case "fullName" -> Sort.by(direction, "givenName").and(Sort.by(direction, "familyName"));
            case "givenName" -> Sort.by(direction, "givenName");
            case "familyName" -> Sort.by(direction, "familyName");
            case "gender" -> Sort.by(direction, "gender");
            case "birthDate" -> Sort.by(direction, "birthDate");
            case "phone" -> Sort.by(direction, "phone");
            case "email" -> Sort.by(direction, "email");
            default -> Sort.unsorted();
        };
    }

    private Specification<Patient> buildSpecification(String search, List<String> filterField, List<String> filterValue) {
        Specification<Patient> spec = Specification.where(null);

        if (search != null && !search.isBlank()) {
            String lowerSearch = "%" + search.toLowerCase() + "%";
            spec = spec.and((root, query, cb) -> cb.or(
                    cb.like(cb.lower(root.get("givenName")), lowerSearch),
                    cb.like(cb.lower(root.get("familyName")), lowerSearch),
                    cb.like(cb.lower(root.get("gender")), lowerSearch),
                    cb.like(cb.lower(root.get("phone")), lowerSearch),
                    cb.like(cb.lower(root.get("email")), lowerSearch),
                    cb.like(cb.function("to_char", String.class, root.get("birthDate"), cb.literal("YYYY-MM-DD")), lowerSearch)
            ));
        }

        if (filterField != null && filterValue != null) {
            int size = Math.min(filterField.size(), filterValue.size());
            for (int i = 0; i < size; i++) {
                String field = filterField.get(i);
                String value = filterValue.get(i);
                if (field == null || field.isBlank() || value == null || value.isBlank()) {
                    continue;
                }

                String lowerValue = "%" + value.toLowerCase() + "%";
                spec = spec.and(buildFieldSpecification(field, lowerValue));
            }
        }

        return spec;
    }

    private Specification<Patient> buildFieldSpecification(String field, String lowerValue) {
        return (root, query, cb) -> {
            return switch (field) {
                case "fullName" -> cb.or(
                        cb.like(cb.lower(root.get("givenName")), lowerValue),
                        cb.like(cb.lower(root.get("familyName")), lowerValue)
                );
                case "givenName" -> cb.like(cb.lower(root.get("givenName")), lowerValue);
                case "familyName" -> cb.like(cb.lower(root.get("familyName")), lowerValue);
                case "gender" -> cb.like(cb.lower(root.get("gender")), lowerValue);
                case "birthDate" -> cb.like(cb.function("to_char", String.class, root.get("birthDate"), cb.literal("YYYY-MM-DD")), lowerValue);
                case "phone" -> cb.like(cb.lower(root.get("phone")), lowerValue);
                case "email" -> cb.like(cb.lower(root.get("email")), lowerValue);
                default -> cb.conjunction();
            };
        };
    }
}
