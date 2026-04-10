package com.mediconnect.user_service.service;

import com.mediconnect.user_service.dto.PatientDto;
import com.mediconnect.user_service.entity.Patient;
import com.mediconnect.user_service.exception.ResourceNotFoundException;
import com.mediconnect.user_service.repository.PatientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PatientService {

    private final PatientRepository patientRepository;

    public PatientDto getPatientById(Long id) {
        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Patient not found with id: "+ id));
        return mapToDto(patient);
    }

    public PatientDto createOrUpdatePatient(Long id, PatientDto dto) {

        Patient patient = patientRepository.findById(id)
                .orElse(new Patient());
                patient.setId(id);
                patient.setFirstName(dto.getFirstName());
                patient.setLastName(dto.getLastName());
                patient.setEmail(dto.getEmail());
                patient.setPhone(dto.getPhone());
                patient.setDateOfBirth(dto.getDateOfBirth());
                patient.setBloodGroup(dto.getBloodGroup());
                patient.setAddress(dto.getAddress());
                patient.setProfilePhotoUrl(dto.getProfilePhotoUrl());
                Patient saved = patientRepository.save(patient);
                return mapToDto(saved);
    }

    private PatientDto mapToDto(Patient patient) {
        return PatientDto.builder()
                .id(patient.getId())
                .firstName(patient.getFirstName())
                .lastName(patient.getLastName())
                .email(patient.getEmail())
                .phone(patient.getPhone())
                .dateOfBirth(patient.getDateOfBirth())
                .bloodGroup(patient.getBloodGroup())
                .address(patient.getAddress())
                .profilePhotoUrl(patient.getProfilePhotoUrl())
                .build();
    }
}
