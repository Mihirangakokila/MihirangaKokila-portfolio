package com.mk.portfolio.controller;

import com.mk.portfolio.dto.ProjectRequest;
import com.mk.portfolio.dto.ProjectResponse;
import com.mk.portfolio.model.ProjectType;
import com.mk.portfolio.service.ProjectService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/portfolio")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;

    @PostMapping(consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    public ResponseEntity<ProjectResponse> createProject(
            @RequestPart("project") @Valid ProjectRequest request,
            @RequestPart(value = "media", required = false) MultipartFile mediaFile) throws IOException {
        return new ResponseEntity<>(projectService.saveProject(request, mediaFile), HttpStatus.CREATED);
    }

    @PutMapping(value = "/{id}", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    public ResponseEntity<ProjectResponse> updateProject(
            @PathVariable String id,
            @RequestPart("project") @Valid ProjectRequest request,
            @RequestPart(value = "media", required = false) MultipartFile mediaFile) throws IOException {
        return ResponseEntity.ok(projectService.updateProject(id, request, mediaFile));
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<List<ProjectResponse>> getProjectsByType(@PathVariable ProjectType type) {
        return ResponseEntity.ok(projectService.getProjectsByType(type));
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<ProjectResponse>> getProjectsByCategory(@PathVariable String category) {
        return ResponseEntity.ok(projectService.getProjectsByCategory(category));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProject(@PathVariable String id) throws IOException {
        projectService.deleteProject(id);
        return ResponseEntity.noContent().build();
    }
}
