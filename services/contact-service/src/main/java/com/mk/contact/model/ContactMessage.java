package com.mk.contact.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "messages")
public class ContactMessage {
    @Id
    private String id;
    private String name;
    private String email;
    private String subject;
    private String message;
    private MessageStatus status;
    private LocalDateTime createdAt;
}