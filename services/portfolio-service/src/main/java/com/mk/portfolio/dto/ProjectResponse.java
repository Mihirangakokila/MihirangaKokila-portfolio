package com.mk.portfolio.dto;

import com.mk.portfolio.model.ProjectType;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class ProjectResponse {
    private String id;
    private String title;
    private String description;
    private ProjectType type;
    private String category;
    private String mediaUrl;
    private List<String> tags;
    private String githubLink;
    private String demoLink;
    private LocalDateTime createdAt;
}