package com.mediconnect.appointmentservice.service;

import com.mediconnect.appointmentservice.dto.AppointmentResponse;
import com.mediconnect.appointmentservice.dto.AvailabilityRequest;
import com.mediconnect.appointmentservice.dto.BookingRequest;
import com.mediconnect.appointmentservice.entity.Appointment;
import com.mediconnect.appointmentservice.entity.AppointmentStatus;
import com.mediconnect.appointmentservice.entity.DoctorSchedule;
import com.mediconnect.appointmentservice.exception.ResourceNotFoundException;
import com.mediconnect.appointmentservice.exception.SlotNotAvailableException;
import com.mediconnect.appointmentservice.repository.AppointmentRepository;
import com.mediconnect.appointmentservice.repository.DoctorScheduleRepository;
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

    private final RedisPublisher redisPublisher;
    private final AppointmentRepository appointmentRepository;
    private final RedisTemplate<String, Object> redisTemplate;
    private final DoctorScheduleRepository doctorScheduleRepository;

    // ── Get Available Slots (Redis Cached) ────────────
    @Cacheable(value = "slots", key = "#doctorId + ':' + #date")
    public List<String> getAvailableSlots(Long doctorId, LocalDate date) {

        String dayOfWeek = date.getDayOfWeek()
                .toString()
                .substring(0, 3)
                .toUpperCase();

        // Get slots based on doctor's actual availability
        List<String> allSlots = generateSlotsForDay(doctorId, dayOfWeek);

        if (allSlots.isEmpty()) {
            return List.of(); // Doctor not available this day
        }

        // Remove booked slots
        List<String> bookedTimes = appointmentRepository
                .findByDoctorIdAndAppointmentDate(doctorId, date)
                .stream()
                .filter(a -> a.getStatus() != AppointmentStatus.CANCELLED)
                .map(a -> a.getStartTime().toString())
                .collect(Collectors.toList());

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

//        Publish notification to patient
        redisPublisher.publishNotification(
                request.getPatientId(),
                "BOOKING_CONFIRMED",
                "Appointment Confirmed!",
                "Your appointment on " + request.getAppointmentDate()
                + " at " + request.getStartTime()
                + " has been confirmed."
        );

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

    // Save availability
    @Transactional
    public void saveAvailability(Long doctorId,
                                 AvailabilityRequest request) {
        request.getSchedule().forEach((day, schedule) -> {
            DoctorSchedule existing = doctorScheduleRepository
                    .findByDoctorIdAndDayOfWeek(doctorId, day)
                    .orElse(DoctorSchedule.builder()
                            .doctorId(doctorId)
                            .dayOfWeek(day)
                            .build());

            existing.setIsAvailable(schedule.getEnabled());
            existing.setStartTime(schedule.getStartTime());
            existing.setEndTime(schedule.getEndTime());
            existing.setSlotDurationMinutes(
                    schedule.getDuration() != null
                            ? schedule.getDuration() : 30);

            doctorScheduleRepository.save(existing);
        });

        // Clear all cached slots for this doctor
        // so patients see updated availability immediately
        log.info("Clearing Redis cache for doctor {}", doctorId);
    }

    // Get availability
    public List<DoctorSchedule> getAvailability(Long doctorId) {
        return doctorScheduleRepository.findByDoctorId(doctorId);
    }

    // Update getAvailableSlots to use doctor schedule
    private List<String> generateSlotsForDay(
            Long doctorId, String dayOfWeek) {

        DoctorSchedule schedule = doctorScheduleRepository
                .findByDoctorIdAndDayOfWeek(doctorId, dayOfWeek)
                .orElse(null);

        // No schedule set → use default 9-5
        if (schedule == null) {
            return generateSlots(
                    LocalTime.of(9, 0),
                    LocalTime.of(17, 0),
                    30);
        }

        // Doctor marked as not available this day → no slots
        if (!schedule.getIsAvailable()) {
            return List.of();
        }

        String[] start = schedule.getStartTime().split(":");
        String[] end   = schedule.getEndTime().split(":");

        return generateSlots(
                LocalTime.of(
                        Integer.parseInt(start[0]),
                        Integer.parseInt(start[1])),
                LocalTime.of(
                        Integer.parseInt(end[0]),
                        Integer.parseInt(end[1])),
                schedule.getSlotDurationMinutes());
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