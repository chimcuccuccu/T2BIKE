package com.example.bikeshop.config;

import com.cloudinary.provisioning.Account;
import com.example.bikeshop.entity.User;
import com.example.bikeshop.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
@RequiredArgsConstructor
public class AdminSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${admin.email}")
    private String adminEmail;

    @Value("${admin.password}")
    private String adminPassword;

    @Override
    public void run(String... args) {
        if (userRepository.findByEmail(adminEmail).isPresent()) {
            return;
        }

        User admin = new User();
        admin.setFullName("Admin");
        admin.setGender("Nam");
        admin.setUsername("admin");
        admin.setEmail(adminEmail);
        admin.setRole("ADMIN");
        admin.setPassword(passwordEncoder.encode(adminPassword));
        admin.setBirthDate(LocalDate.ofEpochDay(22/11/2004));

        userRepository.save(admin);

        System.out.println("✅ Admin created: " + adminEmail);
    }
}
