package com.mk.blog.service;

import com.mk.blog.dto.BlogRequest;
import com.mk.blog.dto.BlogResponse;
import com.mk.blog.model.BlogPost;
import com.mk.blog.repository.BlogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BlogService {

    private final BlogRepository repository;

    /**
     * Creates a new blog post, automatically generating an SEO-friendly URL slug.
     */
    public BlogResponse createPost(BlogRequest request) {
        BlogPost post = BlogPost.builder()
                .title(request.getTitle())
                .slug(generateSlug(request.getTitle()))
                .summary(request.getSummary())
                .content(request.getContent())
                .coverImageUrl(request.getCoverImageUrl())
                .category(request.getCategory())
                .tags(request.getTags())
                .isPublished(request.isPublished())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        return mapToResponse(repository.save(post));
    }

    /**
     * Retrieves all published posts sorted by creation date descending for public view.
     */
    public List<BlogResponse> getAllPublishedPosts() {
        return repository.findByIsPublishedTrueOrderByCreatedAtDesc().stream()
                .map(this::mapToResponse)
                .toList();
    }

    public List<BlogResponse> getAllPosts() {
        return repository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::mapToResponse)
                .toList();
    }

    /**
     * Retrieves a single blog post by its unique SEO slug.
     */
    public BlogResponse getPostBySlug(String slug) {
        BlogPost post = repository.findBySlug(slug)
                .orElseThrow(() -> new RuntimeException("Blog post not found with slug: " + slug));
        return mapToResponse(post);
    }

    /**
     * Searches published posts matching a query string across titles or body content.
     */
    public List<BlogResponse> searchPosts(String query) {
        return repository.findByTitleContainingIgnoreCaseOrContentContainingIgnoreCase(query, query).stream()
                .filter(BlogPost::isPublished)
                .map(this::mapToResponse)
                .toList();
    }

    /**
     * Updates an existing blog post. Regenerates the slug if the title has changed.
     */
    public BlogResponse updatePost(String id, BlogRequest request) {
        BlogPost existingPost = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Blog post not found with id: " + id));

        // If the title changed, regenerate the SEO slug
        if (!existingPost.getTitle().equalsIgnoreCase(request.getTitle())) {
            existingPost.setSlug(generateSlug(request.getTitle()));
        }

        existingPost.setTitle(request.getTitle());
        existingPost.setSummary(request.getSummary());
        existingPost.setContent(request.getContent());
        existingPost.setCoverImageUrl(request.getCoverImageUrl());
        existingPost.setCategory(request.getCategory());
        existingPost.setTags(request.getTags());
        existingPost.setPublished(request.isPublished());
        existingPost.setUpdatedAt(LocalDateTime.now());

        return mapToResponse(repository.save(existingPost));
    }

    /**
     * Deletes a blog post from the database by its ID.
     */
    public void deletePost(String id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("Cannot delete. Blog post not found with id: " + id);
        }
        repository.deleteById(id);
    }

    /**
     * Helper method to map internal BlogPost entities to clean BlogResponse DTOs.
     */
    private BlogResponse mapToResponse(BlogPost post) {
        return BlogResponse.builder()
                .id(post.getId())
                .title(post.getTitle())
                .slug(post.getSlug())
                .summary(post.getSummary())
                .content(post.getContent())
                .coverImageUrl(post.getCoverImageUrl())
                .category(post.getCategory())
                .tags(post.getTags())
                .isPublished(post.isPublished())
                .createdAt(post.getCreatedAt())
                .updatedAt(post.getUpdatedAt())
                .build();
    }

    /**
     * Formats titles into URL-safe, lowercase alphanumeric strings separated by hyphens.
     * Example: "MERN Stack Guide 2026!" -> "mern-stack-guide-2026"
     */
    private String generateSlug(String title) {
        if (title == null || title.isBlank()) {
            return "untitled-" + System.currentTimeMillis();
        }
        return title.toLowerCase()
                .replaceAll("[^a-z0-9\\s-]", "") // Remove all non-alphanumeric/non-space chars
                .trim()
                .replaceAll("\\s+", "-")         // Replace sequential spaces with a single hyphen
                .replaceAll("-+", "-");          // Replace sequential hyphens with a single hyphen
    }
}