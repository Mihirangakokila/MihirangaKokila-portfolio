package com.mk.portfolio.service;

import com.mk.portfolio.dto.ProjectRequest;
import com.mk.portfolio.dto.ProjectResponse;
import com.mk.portfolio.exception.ResourceNotFoundException;
import com.mk.portfolio.model.Project;
import com.mk.portfolio.model.ProjectType;
import com.mk.portfolio.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
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
    private final LocalMediaStorageService localMediaStorageService;

    public ProjectResponse saveProject(ProjectRequest request, MultipartFile mediaFile) throws IOException {
        MediaResolution media = resolveMedia(request, mediaFile);

        Project project = Project.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .type(request.getType())
                .category(request.getCategory())
                .mediaUrl(media.url())
                .cloudinaryPublicId(media.storageKey())
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

        MediaResolution media = resolveMedia(request, mediaFile);
        if (media.changed()) {
            deleteStoredMedia(project.getCloudinaryPublicId(), project.getType());
            project.setMediaUrl(media.url());
            project.setCloudinaryPublicId(media.storageKey());
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

        deleteStoredMedia(project.getCloudinaryPublicId(), project.getType());
        repository.delete(project);
    }

    private MediaResolution resolveMedia(ProjectRequest request, MultipartFile mediaFile) throws IOException {
        if (mediaFile != null && !mediaFile.isEmpty()) {
            if (cloudinaryService.isConfigured()) {
                Map<?, ?> uploadResult = cloudinaryService.uploadMedia(
                        mediaFile, request.getType().name().toLowerCase());
                return new MediaResolution(
                        (String) uploadResult.get("secure_url"),
                        (String) uploadResult.get("public_id"),
                        true
                );
            }

            LocalMediaStorageService.StoredMedia stored = localMediaStorageService.store(mediaFile);
            return new MediaResolution(stored.url(), stored.storageKey(), true);
        }

        if (StringUtils.hasText(request.getMediaUrl())) {
            return new MediaResolution(request.getMediaUrl().trim(), null, true);
        }

        return new MediaResolution(null, null, false);
    }

    private void deleteStoredMedia(String storageKey, ProjectType type) throws IOException {
        if (storageKey == null) {
            return;
        }
        if (storageKey.startsWith(LocalMediaStorageService.STORAGE_KEY_PREFIX)) {
            localMediaStorageService.delete(storageKey);
        } else if (cloudinaryService.isConfigured()) {
            cloudinaryService.deleteMedia(storageKey, type.name());
        }
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

    private record MediaResolution(String url, String storageKey, boolean changed) {}
}
