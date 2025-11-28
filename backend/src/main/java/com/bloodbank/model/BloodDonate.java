package com.bloodbank.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "blood_donations")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BloodDonate {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "donor_id", nullable = false)
    private Donor donor;

    @Column(nullable = false)
    private String disease = "Nothing";

    @Column(nullable = false)
    private Integer age;

    @Column(nullable = false)
    private String bloodGroup;

    @Column(nullable = false)
    private Integer unit;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private DonationStatus status = DonationStatus.PENDING;

    @Column(nullable = false)
    private LocalDate date = LocalDate.now();

    public enum DonationStatus {
        PENDING,
        APPROVED,
        REJECTED
    }
}

