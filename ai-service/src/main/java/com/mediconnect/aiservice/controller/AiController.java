package com.mediconnect.aiservice.controller;

import com.mediconnect.aiservice.dto.*;
import com.mediconnect.aiservice.service.AiService;
import com.mediconnect.aiservice.service.PdfService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
@Tag(name = "AI Service",
        description = "AI-powered medical features")
public class AiController {

    private final AiService aiService;
    private final PdfService pdfService;

    @PostMapping("/symptom-check")
    @Operation(summary = "Analyze symptoms and suggest conditions")
    public ResponseEntity<SymptomResponse> checkSymptoms(
            @Valid @RequestBody SymptomRequest request) {
        return ResponseEntity.ok(
                aiService.checkSymptoms(
                        request.getSymptoms()));
    }

    @PostMapping("/recommend-doctors")
    @Operation(summary = "Get AI doctor recommendations")
    public ResponseEntity<String> recommendDoctors(
            @Valid @RequestBody
            DoctorRecommendationRequest request) {
        return ResponseEntity.ok(
                aiService.recommendDoctors(request));
    }

    @PostMapping("/report-summarize")
    @Operation(summary = "Summarize medical report text")
    public ResponseEntity<ReportSummaryResponse>
    summarizeReport(
            @RequestBody String reportText) {
        return ResponseEntity.ok(
                aiService.summarizeReport(reportText));
    }

    @PostMapping("/chat")
    @Operation(summary = "AI appointment chatbot")
    public ResponseEntity<ChatResponse> chat(
            @Valid @RequestBody ChatRequest request) {
        return ResponseEntity.ok(
                aiService.chat(request.getMessage()));
    }

    @GetMapping("/health")
    @Operation(summary = "Health check")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok(
                "AI Service is running!");
    }

//    For PDF
    @PostMapping(value = "/report-summarize", consumes = {"multipart/form-data"})
    @Operation(summary = "Upload medical PDF and get plain summary")
    public ResponseEntity<ReportSummaryResponse> summarizeReport(
            @RequestParam("file")MultipartFile file) {

        if (file.isEmpty()) {
            throw new RuntimeException("Please upload a PDF file");
        }

        String fileName = file.getOriginalFilename();
        if (fileName == null || !fileName.toLowerCase().endsWith(".pdf")) {
            throw new RuntimeException("Only pdf files are supported");
        }

//        Extract Text from PDF
        String pdfText = pdfService.extractTextFromPdf(file);

//        Pass extracted text to AI

        return ResponseEntity.ok(
                aiService.summarizeReport(pdfText));
    }
}