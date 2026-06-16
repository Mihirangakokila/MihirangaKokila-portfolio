package com.mk.portfolio.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "projects")
public class Project {
    @Id
    private String id;
    private String title;
    private String description;
    private ProjectType type;
    private String category; // e.g., Portrait, Cinematic, Full-Stack
    private String mediaUrl;  // Cloudinary Secure URL
    private String cloudinaryPublicId; // Needed to delete assets from Cloudinary
    private List<String> tags;
    private String githubLink;   // Specific to SOFTWARE
    private String demoLink;     // Specific to SOFTWARE / VIDEO embeds
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}