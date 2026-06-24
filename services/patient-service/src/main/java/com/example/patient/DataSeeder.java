package com.example.patient;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
public class DataSeeder implements CommandLineRunner {

    private final PatientRepository repository;

    public DataSeeder(PatientRepository repository) {
        this.repository = repository;
    }

    @Override
    public void run(String... args) {
        if (repository.count() > 0) {
            return;
        }
        repository.save(new Patient("Aino", "Virtanen", "female", LocalDate.of(1988, 4, 12), "+358401234567", "aino.virtanen@example.fi"));
        repository.save(new Patient("Mikko", "Korhonen", "male", LocalDate.of(1975, 11, 2), "+358407654321", "mikko.korhonen@example.fi"));
        repository.save(new Patient("Khiem", "Nguyen", "male", LocalDate.of(1982, 10, 27), "+358401112233", "khiem.nguyen@example.fi"));
    }
}
