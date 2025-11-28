package com.bloodbank.controller;

import com.bloodbank.model.BloodDonate;
import com.bloodbank.service.BloodDonateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/donations")
public class BloodDonateController {
    @Autowired
    private BloodDonateService bloodDonateService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<BloodDonate>> getAllDonations() {
        return ResponseEntity.ok(bloodDonateService.getAllDonations());
    }

    @GetMapping("/donor/{donorId}")
    @PreAuthorize("hasRole('DONOR') or hasRole('ADMIN')")
    public ResponseEntity<List<BloodDonate>> getDonationsByDonorId(@PathVariable Long donorId) {
        return ResponseEntity.ok(bloodDonateService.getDonationsByDonorId(donorId));
    }

    @PostMapping
    @PreAuthorize("hasRole('DONOR')")
    public ResponseEntity<BloodDonate> createDonation(@RequestBody BloodDonate donation) {
        return ResponseEntity.ok(bloodDonateService.createDonation(donation));
    }

    @PutMapping("/{id}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BloodDonate> approveDonation(@PathVariable Long id) {
        return ResponseEntity.ok(bloodDonateService.approveDonation(id));
    }

    @PutMapping("/{id}/reject")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BloodDonate> rejectDonation(@PathVariable Long id) {
        return ResponseEntity.ok(bloodDonateService.rejectDonation(id));
    }
}

