package com.mediconnect.appointmentservice.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class BookingRequest {

    @NotNull(message = "Patient ID is required")
    private Long patientId;

    @NotNull(message = "Doctor ID is required")
    private Long doctorId;

    @NotNull(message = "Start time is required")
    private LocalTime startTime;

    private String reason;

    @NotNull(message = "Date is required")
    private LocalDate appointmentDate;
}
