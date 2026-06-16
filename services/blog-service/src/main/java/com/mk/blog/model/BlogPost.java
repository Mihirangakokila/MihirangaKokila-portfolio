package com.mk.blog.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "posts")
public class BlogPost {
    @Id
    private String id;
    
    private String title;
    
    @Indexed(unique = true)
    private String slug; // For SEO-friendly URLs (e.g., /blog/mern-stack-guide)
    
    private String summary;
    private String content; // Markdown string
    private String coverImageUrl;
    private String category;
    private List<String> tags;
    
    private boolean isPublished;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}