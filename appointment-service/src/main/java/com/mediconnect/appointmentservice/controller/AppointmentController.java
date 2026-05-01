package com.mediconnect.appointmentservice.controller;

import com.mediconnect.appointmentservice.dto.AppointmentResponse;
import com.mediconnect.appointmentservice.dto.BookingRequest;
import com.mediconnect.appointmentservice.service.AppointmentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/appointments")
@RequiredArgsConstructor
@Tag(name = "Appointments",
        description = "Appointment booking and management")
public class AppointmentController {

    private final AppointmentService appointmentService;

    @GetMapping("/slots/{doctorId}/{date}")
    @Operation(summary = "Get available slots for a doctor on a date")
    public ResponseEntity<List<String>> getAvailableSlots(
            @PathVariable Long doctorId,
            @PathVariable
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate date) {
        return ResponseEntity.ok(
                appointmentService.getAvailableSlots(
                        doctorId, date));
    }

    @PostMapping("/book")
    @Operation(summary = "Book an appointment")
    public ResponseEntity<AppointmentResponse> book(
            @Valid @RequestBody BookingRequest request) {
        return ResponseEntity.ok(
                appointmentService.bookAppointment(request));
    }

    @GetMapping("/patient/{patientId}")
    @Operation(summary = "Get all appointments for a patient")
    public ResponseEntity<List<AppointmentResponse>>
    getPatientAppointments(
            @PathVariable Long patientId) {
        return ResponseEntity.ok(
                appointmentService
                        .getPatientAppointments(patientId));
    }

    @GetMapping("/doctor/{doctorId}")
    @Operation(summary = "Get all appointments for a doctor")
    public ResponseEntity<List<AppointmentResponse>>
    getDoctorAppointments(
            @PathVariable Long doctorId) {
        return ResponseEntity.ok(
                appointmentService
                        .getDoctorAppointments(doctorId));
    }

    @PutMapping("/{id}/cancel")
    @Operation(summary = "Cancel an appointment")
    public ResponseEntity<AppointmentResponse> cancel(
            @PathVariable Long id) {
        return ResponseEntity.ok(
                appointmentService.cancelAppointment(id));
    }

    @PutMapping("/{id}/complete")
    @Operation(summary = "Mark appointment as complete")
    public ResponseEntity<AppointmentResponse> complete(
            @PathVariable Long id,
            @RequestParam(required = false) String notes) {
        return ResponseEntity.ok(
                appointmentService.completeAppointment(
                        id, notes));
    }

    @GetMapping("/health")
    @Operation(summary = "Health check")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok(
                "Appointment Service is running!");
    }
}