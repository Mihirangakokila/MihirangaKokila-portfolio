package com.mk.contact.controller;

import com.mk.contact.dto.ContactRequest;
import com.mk.contact.model.ContactMessage;
import com.mk.contact.service.ContactService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/contact")
@RequiredArgsConstructor
public class ContactController {

    private final ContactService contactService;

    // Public endpoint: Anyone can submit a form
    @PostMapping
    public ResponseEntity<String> submitContactForm(@RequestBody @Valid ContactRequest request) {
        contactService.processNewInquiry(request);
        return new ResponseEntity<>("Message sent successfully", HttpStatus.CREATED);
    }

    // Admin endpoint: Secure route (Gateway should enforce JWT here)
    @GetMapping
    public ResponseEntity<List<ContactMessage>> getAllMessages() {
        return ResponseEntity.ok(contactService.getAllMessages());
    }

    // Admin endpoint: Mark as read
    @PatchMapping("/{id}/read")
    public ResponseEntity<ContactMessage> markAsRead(@PathVariable String id) {
        return ResponseEntity.ok(contactService.markAsRead(id));
    }
}