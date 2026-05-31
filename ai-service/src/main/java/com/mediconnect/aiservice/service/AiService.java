package com.mediconnect.aiservice.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mediconnect.aiservice.dto.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class AiService {

    private final GeminiService geminiService;
    private final ObjectMapper objectMapper;

    // ── Symptom Checker ────────────────────────────────
    public SymptomResponse checkSymptoms(String symptoms) {

        String prompt = """
            You are a medical AI assistant.
            A patient describes their symptoms: "%s"
            
            Respond in this EXACT JSON format only,
            no extra text:
            {
              "possibleConditions": ["condition1", "condition2"],
              "recommendedSpecialization": "Doctor type",
              "urgencyLevel": "LOW/MEDIUM/HIGH",
              "advice": "Brief advice for the patient"
            }
            """.formatted(symptoms);

        String response = geminiService.callGemini(prompt);

        try {
            // Clean response — remove Markdown if present
            String clean = response
                    .replaceAll("```json", "")
                    .replaceAll("```", "")
                    .trim();

            return objectMapper.readValue(
                    clean, SymptomResponse.class);

        } catch (Exception e) {
            log.error("Failed to parse symptom response: {}",
                    e.getMessage());
            return SymptomResponse.builder()
                    .possibleConditions(List.of(
                            "Unable to analyze symptoms"))
                    .recommendedSpecialization(
                            "General Physician")
                    .urgencyLevel("MEDIUM")
                    .advice("Please consult a doctor")
                    .build();
        }
    }

    // ── Doctor Recommendation ──────────────────────────
    public String recommendDoctors(
            DoctorRecommendationRequest request) {

        String prompt = """
            You are a medical AI assistant.
            Patient symptoms: "%s"
            Preferred location: "%s"
            
            Based on these symptoms, recommend the most
            suitable medical specialization and explain why.
            Keep response under 100 words.
            """.formatted(
                request.getSymptoms(),
                request.getPreferredLocation() != null
                        ? request.getPreferredLocation()
                        : "any");

        return geminiService.callGemini(prompt);
    }

    // ── Medical Report Summarizer ──────────────────────
    public ReportSummaryResponse summarizeReport(
            String reportText) {

        String prompt = """
            You are a medical AI assistant.
            Summarize this medical report in simple,
            easy-to-understand language for a patient:
            
            "%s"
            
            Respond in this EXACT JSON format only:
            {
              "summary": "Plain language summary",
              "keyFindings": ["finding1", "finding2"],
              "recommendations": ["rec1", "rec2"],
              "urgencyLevel": "LOW/MEDIUM/HIGH"
            }
            """.formatted(reportText);

        String response = geminiService.callGemini(prompt);

        try {
            String clean = response
                    .replaceAll("```json", "")
                    .replaceAll("```", "")
                    .trim();

            return objectMapper.readValue(
                    clean, ReportSummaryResponse.class);

        } catch (Exception e) {
            log.error("Failed to parse report response: {}",
                    e.getMessage());
            return ReportSummaryResponse.builder()
                    .summary("Unable to process report")
                    .keyFindings(List.of())
                    .recommendations(List.of(
                            "Please consult your doctor"))
                    .urgencyLevel("MEDIUM")
                    .build();
        }
    }

    // ── Appointment Chatbot ────────────────────────────
    public ChatResponse chat(String message) {

        String prompt = """
        You are MediConnect's AI appointment assistant.
        User message: "%s"

        You help patients:
        1. Understand their symptoms
        2. Find the right doctor
        3. Book appointments

        Analyze the message and respond in this
        EXACT JSON format only, no extra text:
        {
          "reply": "Your helpful, friendly response",
          "intent": "BOOK_APPOINTMENT/SYMPTOM_QUERY/GENERAL",
          "requiresBooking": true or false,
          "suggestedSpecialization": "exact specialization
           from this list or null:
           GENERAL_PHYSICIAN, CARDIOLOGIST, DERMATOLOGIST,
           NEUROLOGIST, ORTHOPEDIST, PEDIATRICIAN,
           PSYCHIATRIST, GYNECOLOGIST, OPHTHALMOLOGIST,
           ENT_SPECIALIST, DENTIST, RADIOLOGIST,
           ONCOLOGIST, UROLOGIST, ENDOCRINOLOGIST"
        }

        If user wants to book: set requiresBooking=true
        and give matching specialization.
        If just asking: set requiresBooking=false.
        """.formatted(message);

        String response = geminiService.callGemini(prompt);

        try {
            String clean = response
                    .replaceAll("```json", "")
                    .replaceAll("```", "")
                    .trim();

            return objectMapper.readValue(
                    clean, ChatResponse.class);

        } catch (Exception e) {
            log.error("Failed to parse chat response: {}",
                    e.getMessage());
            return ChatResponse.builder()
                    .reply("I can help you book an " +
                            "appointment. What symptoms " +
                            "are you experiencing?")
                    .intent("GENERAL_QUERY")
                    .requiresBooking(false)
                    .build();
        }
    }
}