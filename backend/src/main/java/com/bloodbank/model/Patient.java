package com.bloodbank.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "patients")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Patient {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    private String profilePic;

    @Column(nullable = false)
    private Integer age;

    @Column(nullable = false)
    private String bloodGroup;

    @Column(nullable = false)
    private String disease;

    @Column(nullable = false)
    private String doctorName;

    @Column(nullable = false)
    private String address;

    @Column(nullable = false)
    private String mobile;
}

