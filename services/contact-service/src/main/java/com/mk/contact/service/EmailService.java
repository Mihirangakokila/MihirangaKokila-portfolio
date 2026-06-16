package com.mk.contact.service;

import com.mk.contact.model.ContactMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String adminEmail;

    @Async
    public void sendNotificationEmail(ContactMessage contact) {
        try {
            SimpleMailMessage mailMessage = new SimpleMailMessage();
            mailMessage.setTo(adminEmail);
            mailMessage.setSubject("New Portfolio Inquiry: " + contact.getSubject());
            mailMessage.setText(
                "You have received a new message from your MK Portfolio!\n\n" +
                "Name: " + contact.getName() + "\n" +
                "Email: " + contact.getEmail() + "\n\n" +
                "Message:\n" + contact.getMessage()
            );
            
            mailSender.send(mailMessage);
            log.info("Notification email sent successfully for message ID: {}", contact.getId());
        } catch (Exception e) {
            log.error("Failed to send email notification", e);
            // We log the error, but since it's @Async, the user's web request won't crash
        }
    }
}