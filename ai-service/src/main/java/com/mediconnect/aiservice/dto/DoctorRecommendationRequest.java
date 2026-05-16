package com.mediconnect.aiservice.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class DoctorRecommendationRequest {

    @NotBlank(message = "Symptoms are required")
    private String symptoms;

    private String preferredLocation;
    private String preferredGender;
}
