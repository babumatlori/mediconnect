package com.mediconnect.user_service.controller;

import com.mediconnect.user_service.dto.PatientDto;
import com.mediconnect.user_service.service.PatientService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users/patients")
@RequiredArgsConstructor
@Tag(name = "Patient", description = "Patient profile management")
public class PatientController {

    private final PatientService patientService;

    @GetMapping("/{id}")
    @Operation(summary = "Get patient by ID")
    public ResponseEntity<PatientDto> getPatient(
            @PathVariable Long id) {
        return ResponseEntity.ok(
                patientService.getPatientById(id));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Create or update patient profile")
    public ResponseEntity<PatientDto> updatePatient(
            @PathVariable Long id,
            @Valid @RequestBody PatientDto dto) {
        return ResponseEntity.ok(
                patientService.createOrUpdatePatient(id, dto)
        );
    }
}
