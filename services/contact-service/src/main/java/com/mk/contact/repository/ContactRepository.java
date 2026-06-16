package com.mk.contact.repository;

import com.mk.contact.model.ContactMessage;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface ContactRepository extends MongoRepository<ContactMessage, String> {
    List<ContactMessage> findAllByOrderByCreatedAtDesc();
}