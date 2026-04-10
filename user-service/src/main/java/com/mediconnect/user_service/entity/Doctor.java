package com.mediconnect.user_service.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Entity
@Table(name = "doctors")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Doctor {

    @Id
    private Long id; // Same as auth service user id

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "last_name")
    private String lastName;

    private String email;
    private String phone;

    @Enumerated(EnumType.STRING)
    private Specialization specialization;

    private String qualification;

    @Column(name = "experience_years")
    private Integer experienceYears;

    @Column(columnDefinition = "TEXT")
    private String bio;

    @Column(name = "consultation_fee")
    private Double consultationFee;

    @Column(name = "profile_photo_url")
    private String profilePhotoUrl;

    @Column(name = "is_available")
    private Boolean isAvailable = true;

    @OneToMany(mappedBy = "doctor",
            cascade = CascadeType.ALL,
            fetch = FetchType.LAZY)
    private List<DoctorAvailability> availabilitySlots;
}