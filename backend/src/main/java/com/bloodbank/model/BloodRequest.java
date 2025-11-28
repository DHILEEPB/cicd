package com.bloodbank.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "blood_requests")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BloodRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "patient_id")
    private Patient patient;

    @ManyToOne
    @JoinColumn(name = "donor_id")
    private Donor donor;

    @Column(nullable = false)
    private String patientName;

    @Column(nullable = false)
    private Integer patientAge;

    @Column(nullable = false, length = 500)
    private String reason;

    @Column(nullable = false)
    private String bloodGroup;

    @Column(nullable = false)
    private Integer unit;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private RequestStatus status = RequestStatus.PENDING;

    @Column(nullable = false)
    private LocalDate date = LocalDate.now();

    public enum RequestStatus {
        PENDING,
        APPROVED,
        REJECTED
    }
}

