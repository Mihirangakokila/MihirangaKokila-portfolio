package com.mk.contact.service;

import com.mk.contact.dto.ContactRequest;
import com.mk.contact.model.ContactMessage;
import com.mk.contact.model.MessageStatus;
import com.mk.contact.repository.ContactRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ContactService {

    private final ContactRepository repository;
    private final EmailService emailService;

    public ContactMessage processNewInquiry(ContactRequest request) {
        ContactMessage message = ContactMessage.builder()
                .name(request.getName())
                .email(request.getEmail())
                .subject(request.getSubject())
                .message(request.getMessage())
                .status(MessageStatus.UNREAD)
                .createdAt(LocalDateTime.now())
                .build();

        ContactMessage savedMessage = repository.save(message);
        
        // Trigger async email notification
        emailService.sendNotificationEmail(savedMessage);
        
        return savedMessage;
    }

    public List<ContactMessage> getAllMessages() {
        return repository.findAllByOrderByCreatedAtDesc();
    }

    public ContactMessage markAsRead(String id) {
        ContactMessage message = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Message not found"));
        message.setStatus(MessageStatus.READ);
        return repository.save(message);
    }
}