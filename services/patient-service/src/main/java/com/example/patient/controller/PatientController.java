package com.example.patient.controller;

import com.example.patient.entity.Patient;
import com.example.patient.dto.PatientRequest;
import com.example.patient.mapper.FhirMapper;
import com.example.patient.repository.PatientRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

    public PatientController(PatientRepository repository) {
        this.repository = repository;
    }

    @GetMapping("/api/patients")
    public List<Patient> listPatients() {
        return repository.findAll();
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

    // --- FHIR-shaped read endpoints, mirroring a real FHIR server's surface ---

    @GetMapping("/fhir/Patient")
    public Map<String, Object> searchFhirPatients() {
        return FhirMapper.toFhirBundle(repository.findAll());
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
}