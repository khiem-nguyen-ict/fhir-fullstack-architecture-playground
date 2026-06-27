package com.example.patient.config;

import com.example.patient.entity.Patient;
import com.example.patient.repository.PatientRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;

@Component
public class DataSeeder implements CommandLineRunner {

    private static final String[] FIRST_NAMES = {
            "Aino", "Mikko", "Khiem", "Elias", "Lilja", "Eemeli", "Emma", "Aada", "Onni", "Venla",
            "Leevi", "Aurora", "Eetu", "Olivia", "Joel", "Vilma", "Matias", "Helena", "Leo", "Siiri",
            "Aleksis", "Kerttu", "Joona", "Iida", "Jimi", "Emilia", "Otto", "Kira", "Eino", "Ella",
            "Niilo", "Anni", "Väinö", "Aava", "Oliver", "Pihla", "Anton", "Sara", "Luka", "Lotta",
            "Kristian", "Milla", "Tatu", "Nelli", "Samu", "Peppi", "Jesse", "Malla", "Topias", "Liisa"
    };

    private static final String[] LAST_NAMES = {
            "Virtanen", "Korhonen", "Nguyen", "Mäkinen", "Nieminen", "Heikkinen", "Koskinen", "Järvinen",
            "Lehtonen", "Peltola", "Salminen", "Rantanen", "Jokinen", "Hämäläinen", "Ahonen", "Laaksonen",
            "Kekkonen", "Aalto", "Repo", "Miettinen", "Salo", "Tuominen", "Ranta", "Karjalainen", "Nurmi",
            "Lindholm", "Kangas", "Kauppinen", "Manninen", "Korpi", "Seppälä", "Heino", "Vainio",
            "Nyman", "Lehtinen", "Hiltunen", "Räsänen", "Pietilä", "Holm", "Rissanen"
    };

    private final PatientRepository repository;

    public DataSeeder(PatientRepository repository) {
        this.repository = repository;
    }

    @Override
    public void run(String... args) {
        if (repository.count() > 0) {
            return;
        }

        List<Patient> patients = new ArrayList<>(300);
        for (int i = 0; i < 300; i++) {
            String firstName = randomFrom(FIRST_NAMES);
            String lastName = randomFrom(LAST_NAMES);
            String gender = randomGender();
            LocalDate birthDate = randomBirthDate();
            String phone = "+35840" + randomDigits(7);
            String email = firstName.toLowerCase() + "." + lastName.toLowerCase() + i + "@example.fi";

            patients.add(new Patient(firstName, lastName, gender, birthDate, phone, email));
        }

        repository.saveAll(patients);
    }

    private static String randomFrom(String[] array) {
        return array[ThreadLocalRandom.current().nextInt(array.length)];
    }

    private static String randomGender() {
        return ThreadLocalRandom.current().nextBoolean() ? "male" : "female";
    }

    private static LocalDate randomBirthDate() {
        long startEpochDay = LocalDate.of(1950, 1, 1).toEpochDay();
        long endEpochDay = LocalDate.of(2005, 12, 31).toEpochDay();
        long randomDay = ThreadLocalRandom.current().nextLong(startEpochDay, endEpochDay + 1);
        return LocalDate.ofEpochDay(randomDay);
    }

    private static String randomDigits(int count) {
        StringBuilder sb = new StringBuilder(count);
        for (int i = 0; i < count; i++) {
            sb.append(ThreadLocalRandom.current().nextInt(10));
        }
        return sb.toString();
    }
}
