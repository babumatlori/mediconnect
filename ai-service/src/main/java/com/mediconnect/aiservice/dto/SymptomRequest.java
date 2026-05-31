package com.mediconnect.aiservice.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class SymptomRequest {
    @NotBlank(message = "Symtoms description is required")
    private String symptoms;
}
