package com.mk.blog.dto;

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
public class BlogResponse {
    private String id;
    private String title;
    private String slug;
    private String summary;
    private String content; // Markdown string
    private String coverImageUrl;
    private String category;
    private List<String> tags;
    private boolean isPublished;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}