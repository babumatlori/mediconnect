package com.mediconnect.aiservice.controller;

import com.mediconnect.aiservice.dto.ChatRequest;
import com.mediconnect.aiservice.dto.ChatResponse;
import com.mediconnect.aiservice.service.AiService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
@Slf4j
public class ChatWebSocketController {

    private final AiService aiService;
    private final SimpMessagingTemplate messagingTemplate;

//    Receive message from client via Websocket

    @MessageMapping("/chat")
    public void handleChatMessage(ChatRequest request) {
        log.info("WebSocket chat message from user {}: {}", request.getUserId(), request.getMessage());

//        Get AI response
        ChatResponse response = aiService.chat(request.getMessage());

//        Send response back to specific user
        String destination = "/topic/chat" + request.getUserId();

        messagingTemplate.convertAndSend(destination, response);

        log.info("Chat response sent to user {}", request.getUserId());
    }
}
