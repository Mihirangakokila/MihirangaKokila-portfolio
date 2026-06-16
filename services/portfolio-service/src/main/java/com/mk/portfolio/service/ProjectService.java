package com.mk.portfolio.service;

import com.mk.portfolio.dto.ProjectRequest;
import com.mk.portfolio.dto.ProjectResponse;
import com.mk.portfolio.exception.ResourceNotFoundException;
import com.mk.portfolio.model.Project;
import com.mk.portfolio.model.ProjectType;
import com.mk.portfolio.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository repository;
    private final CloudinaryService cloudinaryService;

    public ProjectResponse saveProject(ProjectRequest request, MultipartFile mediaFile) throws IOException {
        String mediaUrl = null;
        String publicId = null;

        if (mediaFile != null && !mediaFile.isEmpty()) {
            Map<?, ?> uploadResult = cloudinaryService.uploadMedia(mediaFile, request.getType().name().toLowerCase());
            mediaUrl = (String) uploadResult.get("secure_url");
            publicId = (String) uploadResult.get("public_id");
        }

        Project project = Project.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .type(request.getType())
                .category(request.getCategory())
                .mediaUrl(mediaUrl)
                .cloudinaryPublicId(publicId)
                .tags(request.getTags())
                .githubLink(request.getGithubLink())
                .demoLink(request.getDemoLink())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        return mapToResponse(repository.save(project));
    }

    public ProjectResponse updateProject(String id, ProjectRequest request, MultipartFile mediaFile) throws IOException {
        Project project = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + id));

        if (mediaFile != null && !mediaFile.isEmpty()) {
            if (project.getCloudinaryPublicId() != null) {
                cloudinaryService.deleteMedia(project.getCloudinaryPublicId(), project.getType().name());
            }
            Map<?, ?> uploadResult = cloudinaryService.uploadMedia(mediaFile, request.getType().name().toLowerCase());
            project.setMediaUrl((String) uploadResult.get("secure_url"));
            project.setCloudinaryPublicId((String) uploadResult.get("public_id"));
        }

        project.setTitle(request.getTitle());
        project.setDescription(request.getDescription());
        project.setType(request.getType());
        project.setCategory(request.getCategory());
        project.setTags(request.getTags());
        project.setGithubLink(request.getGithubLink());
        project.setDemoLink(request.getDemoLink());
        project.setUpdatedAt(LocalDateTime.now());

        return mapToResponse(repository.save(project));
    }

    public List<ProjectResponse> getProjectsByType(ProjectType type) {
        return repository.findByType(type).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<ProjectResponse> getProjectsByCategory(String category) {
        return repository.findByCategory(category).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public void deleteProject(String id) throws IOException {
        Project project = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + id));

        if (project.getCloudinaryPublicId() != null) {
            cloudinaryService.deleteMedia(project.getCloudinaryPublicId(), project.getType().name());
        }
        repository.delete(project);
    }

    private ProjectResponse mapToResponse(Project project) {
        return ProjectResponse.builder()
                .id(project.getId())
                .title(project.getTitle())
                .description(project.getDescription())
                .type(project.getType())
                .category(project.getCategory())
                .mediaUrl(project.getMediaUrl())
                .tags(project.getTags())
                .githubLink(project.getGithubLink())
                .demoLink(project.getDemoLink())
                .createdAt(project.getCreatedAt())
                .build();
    }
}
