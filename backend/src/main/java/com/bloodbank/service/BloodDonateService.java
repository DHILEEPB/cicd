package com.bloodbank.service;

import com.bloodbank.model.BloodDonate;
import com.bloodbank.model.BloodDonate.DonationStatus;
import com.bloodbank.model.Stock;
import com.bloodbank.repository.BloodDonateRepository;
import com.bloodbank.repository.StockRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class BloodDonateService {
    @Autowired
    private BloodDonateRepository bloodDonateRepository;

    @Autowired
    private StockRepository stockRepository;

    public List<BloodDonate> getAllDonations() {
        return bloodDonateRepository.findAll();
    }

    public List<BloodDonate> getDonationsByDonorId(Long donorId) {
        return bloodDonateRepository.findByDonor_User_Id(donorId);
    }

    public BloodDonate createDonation(BloodDonate donation) {
        return bloodDonateRepository.save(donation);
    }

    @Transactional
    public BloodDonate approveDonation(Long donationId) {
        BloodDonate donation = bloodDonateRepository.findById(donationId)
                .orElseThrow(() -> new RuntimeException("Donation not found"));

        Stock stock = stockRepository.findByBloodGroup(donation.getBloodGroup())
                .orElseThrow(() -> new RuntimeException("Stock not found"));

        stock.setUnit(stock.getUnit() + donation.getUnit());
        stockRepository.save(stock);

        donation.setStatus(DonationStatus.APPROVED);
        return bloodDonateRepository.save(donation);
    }

    public BloodDonate rejectDonation(Long donationId) {
        BloodDonate donation = bloodDonateRepository.findById(donationId)
                .orElseThrow(() -> new RuntimeException("Donation not found"));
        donation.setStatus(DonationStatus.REJECTED);
        return bloodDonateRepository.save(donation);
    }

    public Optional<BloodDonate> getDonationById(Long id) {
        return bloodDonateRepository.findById(id);
    }
}

