package com.mediconnect.notificationservice.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mediconnect.notificationservice.dto.NotificationEvent;
import com.mediconnect.notificationservice.service.NotificationService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.connection.Message;
import org.springframework.data.redis.connection.MessageListener;

@Slf4j
public class RedisMessageSubscriber implements MessageListener {

    private final NotificationService notificationService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public RedisMessageSubscriber(
            NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @Override
    public void onMessage(Message message, byte[] pattern) {
        try {
            String body = new String(message.getBody());
            log.info("Redis message received: {}", body);

            // ── Key Fix: unwrap double-serialized string ──
            String jsonString = body;

            // If wrapped in quotes, unwrap it first
            if (body.startsWith("\"") && body.endsWith("\"")) {
                // Remove outer quotes and unescape
                jsonString = objectMapper.readValue(
                        body, String.class);
            }

            log.info("Parsed JSON: {}", jsonString);

            NotificationEvent event = objectMapper
                    .readValue(jsonString,
                            NotificationEvent.class);

            log.info("Processing notification for user: {}",
                    event.getUserId());

            notificationService
                    .processAndSendNotification(event);

        } catch (Exception e) {
            log.error("Error processing message: {}",
                    e.getMessage(), e);
        }
    }
}