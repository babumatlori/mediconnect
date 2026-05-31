package com.mediconnect.user_service.dto;

import com.mediconnect.user_service.entity.Specialization;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DoctorDto {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private Specialization specialization;
    private Integer experienceYears;
    private String qualification;
    private Double consultationFee;
    private String bio;
    private String profilePhotoUrl;
    private Boolean isAvailable;
}
