package com.bloodbank.controller;

import com.bloodbank.model.BloodRequest;
import com.bloodbank.service.BloodRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/requests")
public class BloodRequestController {
    @Autowired
    private BloodRequestService bloodRequestService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<BloodRequest>> getAllRequests() {
        return ResponseEntity.ok(bloodRequestService.getAllRequests());
    }

    @GetMapping("/pending")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<BloodRequest>> getPendingRequests() {
        return ResponseEntity.ok(bloodRequestService.getPendingRequests());
    }

    @GetMapping("/patient/{patientId}")
    @PreAuthorize("hasRole('PATIENT') or hasRole('ADMIN')")
    public ResponseEntity<List<BloodRequest>> getRequestsByPatientId(@PathVariable Long patientId) {
        return ResponseEntity.ok(bloodRequestService.getRequestsByPatientId(patientId));
    }

    @GetMapping("/donor/{donorId}")
    @PreAuthorize("hasRole('DONOR') or hasRole('ADMIN')")
    public ResponseEntity<List<BloodRequest>> getRequestsByDonorId(@PathVariable Long donorId) {
        return ResponseEntity.ok(bloodRequestService.getRequestsByDonorId(donorId));
    }

    @PostMapping
    @PreAuthorize("hasRole('DONOR') or hasRole('PATIENT')")
    public ResponseEntity<BloodRequest> createRequest(@RequestBody BloodRequest request) {
        return ResponseEntity.ok(bloodRequestService.createRequest(request));
    }

    @PutMapping("/{id}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> approveRequest(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(bloodRequestService.approveRequest(id));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}/reject")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BloodRequest> rejectRequest(@PathVariable Long id) {
        return ResponseEntity.ok(bloodRequestService.rejectRequest(id));
    }
}

