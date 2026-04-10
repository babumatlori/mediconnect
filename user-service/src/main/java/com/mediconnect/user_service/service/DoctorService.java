package com.mediconnect.user_service.service;

import com.mediconnect.user_service.dto.DoctorDto;
import com.mediconnect.user_service.entity.Doctor;
import com.mediconnect.user_service.entity.Specialization;
import com.mediconnect.user_service.exception.ResourceNotFoundException;
import com.mediconnect.user_service.repository.DoctorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DoctorService {

    private final DoctorRepository doctorRepository;

    public List<DoctorDto> getAllDoctors() {
        return doctorRepository.findAll()
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public List<DoctorDto> getAvailableDoctors() {
        return doctorRepository.findByIsAvailableTrue()
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public DoctorDto getDoctorById(Long id) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Doctor not found with id: " +id));
        return mapToDto(doctor);
    }

    public List<DoctorDto> getDoctorsBySpecialization(
            String specialization) {
        Specialization spec = Specialization.valueOf(
                specialization.toUpperCase());
        return doctorRepository.findBySpecialization(spec)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public DoctorDto createOrUpdateDoctor(Long id, DoctorDto dto) {
        Doctor doctor = doctorRepository.findById(id)
                .orElse(new Doctor());
        doctor.setId(id);
        doctor.setFirstName(dto.getFirstName());
        doctor.setLastName(dto.getLastName());
        doctor.setEmail(dto.getEmail());
        doctor.setPhone(dto.getPhone());
        doctor.setSpecialization(dto.getSpecialization());
        doctor.setQualification(dto.getQualification());
        doctor.setExperienceYears(dto.getExperienceYears());
        doctor.setBio(dto.getBio());
        doctor.setProfilePhotoUrl(dto.getProfilePhotoUrl());
        doctor.setConsultationFee(dto.getConsultationFee());
        doctor.setIsAvailable(dto.getIsAvailable() != null
               ? dto.getIsAvailable() : true);
        Doctor saved = doctorRepository.save(doctor);
        return mapToDto(saved);
    }

    public DoctorDto mapToDto(Doctor doctor) {
        return DoctorDto.builder()
                .id(doctor.getId())
                .firstName(doctor.getFirstName())
                .lastName(doctor.getLastName())
                .email(doctor.getEmail())
                .phone(doctor.getPhone())
                .specialization(doctor.getSpecialization())
                .qualification(doctor.getQualification())
                .experienceYears(doctor.getExperienceYears())
                .bio(doctor.getBio())
                .consultationFee(doctor.getConsultationFee())
                .profilePhotoUrl(doctor.getProfilePhotoUrl())
                .isAvailable(doctor.getIsAvailable())
                .build();
    }
}
