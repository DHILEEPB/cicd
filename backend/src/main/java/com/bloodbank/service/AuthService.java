package com.bloodbank.service;

import com.bloodbank.dto.JwtResponse;
import com.bloodbank.dto.LoginRequest;
import com.bloodbank.dto.SignupRequest;
import com.bloodbank.model.*;
import com.bloodbank.repository.*;
import com.bloodbank.security.jwt.JwtUtils;
import com.bloodbank.security.services.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class AuthService {
    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    DonorRepository donorRepository;

    @Autowired
    PatientRepository patientRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;

    public JwtResponse authenticateUser(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        List<String> roles = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());

        User user = userRepository.findById(userDetails.getId()).orElseThrow();

        return new JwtResponse(jwt,
                "Bearer",
                userDetails.getId(),
                userDetails.getUsername(),
                userDetails.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                roles);
    }

    @Transactional
    public String registerUser(SignupRequest signUpRequest) {
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            return "Error: Username is already taken!";
        }

        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return "Error: Email is already in use!";
        }

        // Create new user's account
        User user = new User();
        user.setUsername(signUpRequest.getUsername());
        user.setEmail(signUpRequest.getEmail());
        user.setPassword(encoder.encode(signUpRequest.getPassword()));
        user.setFirstName(signUpRequest.getFirstName());
        user.setLastName(signUpRequest.getLastName());

        Set<String> strRoles = signUpRequest.getRole();
        Set<Role> roles = new HashSet<>();

        if (strRoles == null || strRoles.isEmpty()) {
            Role userRole = roleRepository.findByName(Role.ERole.ROLE_PATIENT)
                    .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
            roles.add(userRole);
        } else {
            strRoles.forEach(role -> {
                switch (role) {
                    case "admin":
                        Role adminRole = roleRepository.findByName(Role.ERole.ROLE_ADMIN)
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(adminRole);
                        break;
                    case "donor":
                        Role donorRole = roleRepository.findByName(Role.ERole.ROLE_DONOR)
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(donorRole);
                        break;
                    default:
                        Role patientRole = roleRepository.findByName(Role.ERole.ROLE_PATIENT)
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(patientRole);
                }
            });
        }

        user.setRoles(roles);
        user = userRepository.save(user);

        // Create donor or patient profile
        if (strRoles != null && strRoles.contains("donor")) {
            Donor donor = new Donor();
            donor.setUser(user);
            donor.setBloodGroup(signUpRequest.getBloodGroup());
            donor.setAddress(signUpRequest.getAddress());
            donor.setMobile(signUpRequest.getMobile());
            donorRepository.save(donor);
        } else if (strRoles == null || strRoles.contains("patient") || strRoles.isEmpty()) {
            Patient patient = new Patient();
            patient.setUser(user);
            patient.setAge(signUpRequest.getAge());
            patient.setBloodGroup(signUpRequest.getBloodGroup());
            patient.setDisease(signUpRequest.getDisease());
            patient.setDoctorName(signUpRequest.getDoctorName());
            patient.setAddress(signUpRequest.getAddress());
            patient.setMobile(signUpRequest.getMobile());
            patientRepository.save(patient);
        }

        return "User registered successfully!";
    }
}

