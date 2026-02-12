package com.test.qoldanqolga.controller;

import com.test.qoldanqolga.dto.chat.ConversationDto;
import com.test.qoldanqolga.dto.chat.MessageDto;
import com.test.qoldanqolga.dto.chat.SendMessageRequest;
import com.test.qoldanqolga.service.chat.ChatService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    @GetMapping("/conversations")
    public ResponseEntity<List<ConversationDto>> listConversations(
            @AuthenticationPrincipal UserDetails user) {
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(chatService.getConversationsForUser(user.getUsername()));
    }

    @PostMapping("/conversations")
    public ResponseEntity<ConversationDto> getOrCreateConversation(
            @RequestBody GetOrCreateRequest request,
            @AuthenticationPrincipal UserDetails user) {
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(chatService.getOrCreateConversation(request.getAdId(), user.getUsername()));
    }

    @GetMapping("/conversations/{conversationId}/messages")
    public ResponseEntity<List<MessageDto>> getMessages(
            @PathVariable String conversationId,
            @AuthenticationPrincipal UserDetails user) {
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(chatService.getMessages(conversationId, user.getUsername()));
    }

    @PostMapping("/conversations/{conversationId}/messages")
    public ResponseEntity<MessageDto> sendMessage(
            @PathVariable String conversationId,
            @Valid @RequestBody SendMessageRequest request,
            @AuthenticationPrincipal UserDetails user) {
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(chatService.sendMessage(conversationId, user.getUsername(), request.getText()));
    }

    @PostMapping("/conversations/{conversationId}/read")
    public ResponseEntity<Void> markAsRead(
            @PathVariable String conversationId,
            @AuthenticationPrincipal UserDetails user) {
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        chatService.markAsRead(conversationId, user.getUsername());
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/conversations/{conversationId}/messages/{messageId}")
    public ResponseEntity<MessageDto> updateMessage(
            @PathVariable String conversationId,
            @PathVariable String messageId,
            @Valid @RequestBody SendMessageRequest request,
            @AuthenticationPrincipal UserDetails user) {
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(chatService.updateMessage(conversationId, messageId, user.getUsername(), request.getText()));
    }

    @DeleteMapping("/conversations/{conversationId}/messages/{messageId}")
    public ResponseEntity<Void> deleteMessage(
            @PathVariable String conversationId,
            @PathVariable String messageId,
            @AuthenticationPrincipal UserDetails user) {
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        chatService.deleteMessage(conversationId, messageId, user.getUsername());
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/conversations/{conversationId}")
    public ResponseEntity<Void> deleteConversation(
            @PathVariable String conversationId,
            @AuthenticationPrincipal UserDetails user) {
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        chatService.deleteConversation(conversationId, user.getUsername());
        return ResponseEntity.noContent().build();
    }

    @lombok.Data
    public static class GetOrCreateRequest {
        private String adId;
    }
}
