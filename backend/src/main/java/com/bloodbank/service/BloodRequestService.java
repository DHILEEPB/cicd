package com.bloodbank.service;

import com.bloodbank.model.BloodRequest;
import com.bloodbank.model.BloodRequest.RequestStatus;
import com.bloodbank.model.Stock;
import com.bloodbank.repository.BloodRequestRepository;
import com.bloodbank.repository.StockRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class BloodRequestService {
    @Autowired
    private BloodRequestRepository bloodRequestRepository;

    @Autowired
    private StockRepository stockRepository;

    public List<BloodRequest> getAllRequests() {
        return bloodRequestRepository.findAll();
    }

    public List<BloodRequest> getPendingRequests() {
        return bloodRequestRepository.findByStatus(RequestStatus.PENDING);
    }

    public List<BloodRequest> getRequestsByPatientId(Long patientId) {
        return bloodRequestRepository.findByPatient_User_Id(patientId);
    }

    public List<BloodRequest> getRequestsByDonorId(Long donorId) {
        return bloodRequestRepository.findByDonor_User_Id(donorId);
    }

    public BloodRequest createRequest(BloodRequest request) {
        return bloodRequestRepository.save(request);
    }

    @Transactional
    public BloodRequest approveRequest(Long requestId) {
        BloodRequest request = bloodRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        Stock stock = stockRepository.findByBloodGroup(request.getBloodGroup())
                .orElseThrow(() -> new RuntimeException("Stock not found"));

        if (stock.getUnit() >= request.getUnit()) {
            stock.setUnit(stock.getUnit() - request.getUnit());
            stockRepository.save(stock);
            request.setStatus(RequestStatus.APPROVED);
        } else {
            throw new RuntimeException("Insufficient blood stock. Only " + stock.getUnit() + " units available.");
        }

        return bloodRequestRepository.save(request);
    }

    public BloodRequest rejectRequest(Long requestId) {
        BloodRequest request = bloodRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));
        request.setStatus(RequestStatus.REJECTED);
        return bloodRequestRepository.save(request);
    }

    public Optional<BloodRequest> getRequestById(Long id) {
        return bloodRequestRepository.findById(id);
    }
}

