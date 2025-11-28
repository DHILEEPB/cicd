package com.bloodbank.repository;

import com.bloodbank.model.BloodDonate;
import com.bloodbank.model.BloodDonate.DonationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BloodDonateRepository extends JpaRepository<BloodDonate, Long> {
    List<BloodDonate> findByStatus(DonationStatus status);
    List<BloodDonate> findByDonor_User_Id(Long userId);
}

