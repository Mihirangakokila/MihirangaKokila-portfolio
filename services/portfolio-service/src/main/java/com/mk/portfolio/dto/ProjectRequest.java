package com.mk.portfolio.dto;

import com.mk.portfolio.model.ProjectType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.util.List;

@Data
public class ProjectRequest {
    @NotBlank(message = "Title is required")
    private String title;
    
    @NotBlank(message = "Description is required")
    private String description;
    
    @NotNull(message = "Project type is required")
    private ProjectType type;
    
    @NotBlank(message = "Category is required")
    private String category;
    
    private List<String> tags;
    private String githubLink;
    private String demoLink;
}