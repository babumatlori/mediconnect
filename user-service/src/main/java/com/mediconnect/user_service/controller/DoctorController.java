package com.mediconnect.user_service.controller;

import com.mediconnect.user_service.dto.DoctorDto;
import com.mediconnect.user_service.service.DoctorService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users/doctors")
@RequiredArgsConstructor
@Tag(name = "Doctor", description = "Doctor profile management")
public class DoctorController {

    private final DoctorService doctorService;

    @GetMapping
    @Operation(summary = "Get all doctors")
    public ResponseEntity<List<DoctorDto>> getAvailableDoctors() {
        return ResponseEntity.ok(
                doctorService.getAvailableDoctors()
        );
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get doctor by id")
    public ResponseEntity<DoctorDto> getDoctorById(
            @PathVariable Long id) {
        return ResponseEntity.ok(
                doctorService.getDoctorById(id)
        );
    }

    @GetMapping("/specialization/{specialization}")
    @Operation(summary = "Get doctors by specialization")
    public ResponseEntity<List<DoctorDto>> getBySpecialization(
            @PathVariable String specialization
    ) {
        return ResponseEntity.ok(
                doctorService.getDoctorsBySpecialization(
                        specialization));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Create or update doctor profile")
    public ResponseEntity<DoctorDto> updateDoctor(
            @PathVariable Long id,
            @RequestBody DoctorDto dto) {
        return ResponseEntity.ok(
                doctorService.createOrUpdateDoctor(id, dto));
    }

    @GetMapping("/health")
    @Operation(summary = "Health check")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("User Service is running!");
    }
}
