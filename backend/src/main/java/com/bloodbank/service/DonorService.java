package com.bloodbank.service;

import com.bloodbank.model.Donor;
import com.bloodbank.repository.DonorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DonorService {
    @Autowired
    private DonorRepository donorRepository;

    public List<Donor> getAllDonors() {
        return donorRepository.findAll();
    }

    public Optional<Donor> getDonorById(Long id) {
        return donorRepository.findById(id);
    }

    public Optional<Donor> getDonorByUserId(Long userId) {
        return donorRepository.findByUser_Id(userId);
    }

    public Donor updateDonor(Long id, Donor donorDetails) {
        Donor donor = donorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Donor not found"));
        donor.setBloodGroup(donorDetails.getBloodGroup());
        donor.setAddress(donorDetails.getAddress());
        donor.setMobile(donorDetails.getMobile());
        if (donorDetails.getProfilePic() != null) {
            donor.setProfilePic(donorDetails.getProfilePic());
        }
        return donorRepository.save(donor);
    }

    public void deleteDonor(Long id) {
        donorRepository.deleteById(id);
    }
}

