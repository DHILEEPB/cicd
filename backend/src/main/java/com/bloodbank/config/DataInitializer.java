package com.bloodbank.config;

import com.bloodbank.model.Role;
import com.bloodbank.repository.RoleRepository;
import com.bloodbank.service.StockService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {
    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private StockService stockService;

    @Override
    public void run(String... args) throws Exception {
        // Initialize roles
        if (roleRepository.findByName(Role.ERole.ROLE_ADMIN).isEmpty()) {
            Role adminRole = new Role();
            adminRole.setName(Role.ERole.ROLE_ADMIN);
            roleRepository.save(adminRole);
        }

        if (roleRepository.findByName(Role.ERole.ROLE_DONOR).isEmpty()) {
            Role donorRole = new Role();
            donorRole.setName(Role.ERole.ROLE_DONOR);
            roleRepository.save(donorRole);
        }

        if (roleRepository.findByName(Role.ERole.ROLE_PATIENT).isEmpty()) {
            Role patientRole = new Role();
            patientRole.setName(Role.ERole.ROLE_PATIENT);
            roleRepository.save(patientRole);
        }

        // Initialize blood groups
        stockService.initializeBloodGroups();
    }
}

