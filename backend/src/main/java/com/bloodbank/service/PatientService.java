package com.bloodbank.service;

import com.bloodbank.model.Patient;
import com.bloodbank.repository.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PatientService {
    @Autowired
    private PatientRepository patientRepository;

    public List<Patient> getAllPatients() {
        return patientRepository.findAll();
    }

    public Optional<Patient> getPatientById(Long id) {
        return patientRepository.findById(id);
    }

    public Optional<Patient> getPatientByUserId(Long userId) {
        return patientRepository.findByUser_Id(userId);
    }

    public Patient updatePatient(Long id, Patient patientDetails) {
        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Patient not found"));
        patient.setAge(patientDetails.getAge());
        patient.setBloodGroup(patientDetails.getBloodGroup());
        patient.setDisease(patientDetails.getDisease());
        patient.setDoctorName(patientDetails.getDoctorName());
        patient.setAddress(patientDetails.getAddress());
        patient.setMobile(patientDetails.getMobile());
        if (patientDetails.getProfilePic() != null) {
            patient.setProfilePic(patientDetails.getProfilePic());
        }
        return patientRepository.save(patient);
    }

    public void deletePatient(Long id) {
        patientRepository.deleteById(id);
    }
}

