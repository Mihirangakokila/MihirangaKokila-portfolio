package com.mk.blog.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import java.util.List;

@Data
public class BlogRequest {
    @NotBlank(message = "Title is required")
    private String title;
    
    @NotBlank(message = "Summary is required")
    private String summary;
    
    @NotBlank(message = "Content is required")
    private String content;
    
    private String coverImageUrl;
    
    @NotBlank(message = "Category is required")
    private String category;
    
    private List<String> tags;
    private boolean isPublished;
}