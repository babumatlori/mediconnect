package com.mediconnect.appointmentservice.repository;

import com.mediconnect.appointmentservice.entity.DoctorSchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface DoctorScheduleRepository
        extends JpaRepository<DoctorSchedule, Long> {

    Optional<DoctorSchedule> findByDoctorIdAndDayOfWeek(
            Long doctorId, String dayOfWeek);

    List<DoctorSchedule> findByDoctorId(Long doctorId);
}