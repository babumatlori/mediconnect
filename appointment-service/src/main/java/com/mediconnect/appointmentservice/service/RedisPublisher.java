package com.mediconnect.appointmentservice.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class RedisPublisher {

    private final RedisTemplate<String, Object> redisTemplate;
    private final ObjectMapper objectMapper =
            new ObjectMapper();

    public void publishNotification(Long userId,
                                    String type,
                                    String title,
                                    String message) {
        try {
            Map<String, Object> event = Map.of(
                    "userId", userId,
                    "type", type,
                    "title", title,
                    "message", message
            );

            String json = objectMapper
                    .writeValueAsString(event);

            redisTemplate.convertAndSend(
                    "notification-channel", json);

            log.info("Published notification to Redis " +
                    "for user {}", userId);

        } catch (Exception e) {
            log.error("Failed to publish notification: {}",
                    e.getMessage());
        }
    }
}