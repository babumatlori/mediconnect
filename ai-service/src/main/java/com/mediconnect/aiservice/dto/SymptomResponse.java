package com.mediconnect.aiservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SymptomResponse {
    private List<String> possibleConditions;
    private String recommendedSpecialization;
    private String urgencyLevel;
    private String advice;
}