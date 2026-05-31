package com.mediconnect.appointmentservice.repository;

import com.mediconnect.appointmentservice.entity.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    List<Appointment> findByPatientId(long patientId);

    List<Appointment> findByDoctorId(long doctorId);

    List<Appointment> findByDoctorIdAndAppointmentDate(
            Long doctorId, LocalDate date );

    @Query("SELECT a FROM Appointment a WHERE " +
    "a.doctorId = :doctorId AND " +
    "a.appointmentDate = :date AND " +
    "a.startTime = :startTime AND " +
    "a.status != 'CANCLLED'")

    List<Appointment> findConflicting(
            Long doctorId,
            LocalDate date,
            LocalTime startTime
    );
}
