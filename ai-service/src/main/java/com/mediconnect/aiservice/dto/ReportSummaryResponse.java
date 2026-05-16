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
public class ReportSummaryResponse {
    private String summary;
    private List<String> keyFindings;
    private List<String> recommendations;
    private String urgencyLevel;
}
