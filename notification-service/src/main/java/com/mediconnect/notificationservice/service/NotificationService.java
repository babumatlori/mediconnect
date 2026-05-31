package com.mediconnect.notificationservice.service;

import com.mediconnect.notificationservice.dto.NotificationDto;
import com.mediconnect.notificationservice.dto.NotificationEvent;
import com.mediconnect.notificationservice.entity.Notification;
import com.mediconnect.notificationservice.entity.NotificationType;
import com.mediconnect.notificationservice.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final SimpMessagingTemplate messagingTemplate;

    // ── Process Event from Redis & Send via WebSocket ──
    @Transactional
    public void processAndSendNotification(
            NotificationEvent event) {

        // Save to DB
        Notification notification = Notification.builder()
                .userId(event.getUserId())
                .type(NotificationType.valueOf(event.getType()))
                .title(event.getTitle())
                .message(event.getMessage())
                .isRead(false)
                .build();

        Notification saved = notificationRepository
                .save(notification);

        // Send via WebSocket to specific user
        String destination = "/topic/notifications/"
                + event.getUserId();

        messagingTemplate.convertAndSend(
                destination, mapToDto(saved));

        log.info("Notification sent to user {} via WebSocket",
                event.getUserId());
    }

    // ── Get All Notifications for User ────────────────
    public List<NotificationDto> getUserNotifications(
            Long userId) {
        return notificationRepository
                .findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    // ── Get Unread Count ───────────────────────────────
    public long getUnreadCount(Long userId) {
        return notificationRepository
                .findByUserIdAndIsReadFalse(userId)
                .size();
    }

    // ── Mark as Read ───────────────────────────────────
    @Transactional
    public void markAsRead(Long notificationId) {
        notificationRepository.findById(notificationId)
                .ifPresent(n -> {
                    n.setIsRead(true);
                    notificationRepository.save(n);
                });
    }

    // ── Mark All as Read ───────────────────────────────
    @Transactional
    public void markAllAsRead(Long userId) {
        List<Notification> unread = notificationRepository
                .findByUserIdAndIsReadFalse(userId);
        unread.forEach(n -> n.setIsRead(true));
        notificationRepository.saveAll(unread);
    }

    // ── Map to DTO ─────────────────────────────────────
    private NotificationDto mapToDto(Notification n) {
        return NotificationDto.builder()
                .id(n.getId())
                .userId(n.getUserId())
                .type(n.getType())
                .title(n.getTitle())
                .message(n.getMessage())
                .isRead(n.getIsRead())
                .createdAt(n.getCreatedAt())
                .build();
    }
}