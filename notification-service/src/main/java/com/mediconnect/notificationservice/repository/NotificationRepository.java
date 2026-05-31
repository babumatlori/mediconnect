package com.mediconnect.notificationservice.repository;

import com.mediconnect.notificationservice.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface NotificationRepository
        extends JpaRepository<Notification, Long> {

    List<Notification> findByUserIdOrderByCreatedAtDesc(
            Long userId);

    List<Notification> findByUserIdAndIsReadFalse(Long userId);
}