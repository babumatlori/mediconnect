package com.mediconnect.appointmentservice.service;

import com.mediconnect.appointmentservice.dto.AppointmentResponse;
import com.mediconnect.appointmentservice.dto.BookingRequest;
import com.mediconnect.appointmentservice.entity.Appointment;
import com.mediconnect.appointmentservice.entity.AppointmentStatus;
import com.mediconnect.appointmentservice.exception.ResourceNotFoundException;
import com.mediconnect.appointmentservice.exception.SlotNotAvailableException;
import com.mediconnect.appointmentservice.repository.AppointmentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final RedisTemplate<String, Object> redisTemplate;

    // ── Get Available Slots (Redis Cached) ────────────
    @Cacheable(value = "slots",
            key = "#doctorId + ':' + #date")
    public List<String> getAvailableSlots(
            Long doctorId, LocalDate date) {

        log.debug("Fetching slots from DB for doctor {} on {}",
                doctorId, date);

        // Generate all possible slots (9 AM to 5 PM, 30 min each)
        List<String> allSlots = generateSlots(
                LocalTime.of(9, 0),
                LocalTime.of(17, 0),
                30);

        // Get booked slots from DB
        List<Appointment> booked = appointmentRepository
                .findByDoctorIdAndAppointmentDate(doctorId, date)
                .stream()
                .filter(a -> a.getStatus() !=
                        AppointmentStatus.CANCELLED)
                .collect(Collectors.toList());

        List<String> bookedTimes = booked.stream()
                .map(a -> a.getStartTime().toString())
                .collect(Collectors.toList());

        // Return only available slots
        return allSlots.stream()
                .filter(slot -> !bookedTimes.contains(slot))
                .collect(Collectors.toList());
    }

    // ── Book Appointment ───────────────────────────────
    @Transactional
    @CacheEvict(value = "slots",
            key = "#request.doctorId + ':' + #request.appointmentDate")
    public AppointmentResponse bookAppointment(
            BookingRequest request) {

        // Check for conflicts
        List<Appointment> conflicts = appointmentRepository
                .findConflicting(
                        request.getDoctorId(),
                        request.getAppointmentDate(),
                        request.getStartTime());

        if (!conflicts.isEmpty()) {
            throw new SlotNotAvailableException(
                    "This slot is already booked. " +
                            "Please choose another time.");
        }

        // Create appointment
        Appointment appointment = Appointment.builder()
                .patientId(request.getPatientId())
                .doctorId(request.getDoctorId())
                .appointmentDate(request.getAppointmentDate())
                .startTime(request.getStartTime())
                .endTime(request.getStartTime().plusMinutes(30))
                .status(AppointmentStatus.CONFIRMED)
                .reason(request.getReason())
                .build();

        Appointment saved = appointmentRepository
                .save(appointment);

        log.info("Appointment booked: ID={}, Doctor={}, " +
                        "Patient={}, Date={}",
                saved.getId(), saved.getDoctorId(),
                saved.getPatientId(),
                saved.getAppointmentDate());

        return mapToResponse(saved);
    }

    // ── Get Patient Appointments ───────────────────────
    public List<AppointmentResponse> getPatientAppointments(
            Long patientId) {
        return appointmentRepository
                .findByPatientId(patientId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // ── Get Doctor Appointments ────────────────────────
    public List<AppointmentResponse> getDoctorAppointments(
            Long doctorId) {
        return appointmentRepository
                .findByDoctorId(doctorId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // ── Cancel Appointment ─────────────────────────────
    @Transactional
    public AppointmentResponse cancelAppointment(Long id) {
        Appointment appointment = appointmentRepository
                .findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Appointment not found: " + id));

        appointment.setStatus(AppointmentStatus.CANCELLED);

        // Evict cache so slot becomes available again
        String cacheKey = "slots::" +
                appointment.getDoctorId() + ":" +
                appointment.getAppointmentDate();
        redisTemplate.delete(cacheKey);

        return mapToResponse(
                appointmentRepository.save(appointment));
    }

    // ── Complete Appointment ───────────────────────────
    @Transactional
    public AppointmentResponse completeAppointment(
            Long id, String notes) {
        Appointment appointment = appointmentRepository
                .findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Appointment not found: " + id));

        appointment.setStatus(AppointmentStatus.COMPLETED);
        appointment.setNotes(notes);

        return mapToResponse(
                appointmentRepository.save(appointment));
    }

    // ── Generate Time Slots ────────────────────────────
    private List<String> generateSlots(
            LocalTime start,
            LocalTime end,
            int durationMinutes) {
        List<String> slots = new ArrayList<>();
        LocalTime current = start;
        while (current.isBefore(end)) {
            slots.add(current.toString());
            current = current.plusMinutes(durationMinutes);
        }
        return slots;
    }

    // ── Map to Response ────────────────────────────────
    private AppointmentResponse mapToResponse(
            Appointment a) {
        return AppointmentResponse.builder()
                .id(a.getId())
                .patientId(a.getPatientId())
                .doctorId(a.getDoctorId())
                .appointmentDate(a.getAppointmentDate())
                .startTime(a.getStartTime())
                .endTime(a.getEndTime())
                .status(a.getStatus())
                .reason(a.getReason())
                .notes(a.getNotes())
                .build();
    }
}