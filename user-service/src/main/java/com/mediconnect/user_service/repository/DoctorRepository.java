package com.mediconnect.user_service.repository;

import com.mediconnect.user_service.entity.Doctor;
import com.mediconnect.user_service.entity.Specialization;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, Long> {

    List<Doctor> findBySpecialization(Specialization specialization);
    List<Doctor> findByIsAvailableTrue();
}
