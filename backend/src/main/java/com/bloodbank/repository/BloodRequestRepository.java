package com.bloodbank.repository;

import com.bloodbank.model.BloodRequest;
import com.bloodbank.model.BloodRequest.RequestStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BloodRequestRepository extends JpaRepository<BloodRequest, Long> {
    List<BloodRequest> findByStatus(RequestStatus status);
    List<BloodRequest> findByPatient_User_Id(Long userId);
    List<BloodRequest> findByDonor_User_Id(Long userId);
}

