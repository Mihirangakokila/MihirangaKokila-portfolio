package com.mk.blog.controller;

import com.mk.blog.dto.BlogRequest;
import com.mk.blog.dto.BlogResponse;
import com.mk.blog.service.BlogService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/blog")
@RequiredArgsConstructor
public class BlogController {

    private final BlogService blogService;

    @GetMapping
    public ResponseEntity<List<BlogResponse>> getAllPosts() {
        return ResponseEntity.ok(blogService.getAllPublishedPosts());
    }

    @GetMapping("/{slug}")
    public ResponseEntity<BlogResponse> getPost(@PathVariable String slug) {
        return ResponseEntity.ok(blogService.getPostBySlug(slug));
    }

    @GetMapping("/search")
    public ResponseEntity<List<BlogResponse>> searchPosts(@RequestParam String query) {
        return ResponseEntity.ok(blogService.searchPosts(query));
    }

    @PostMapping
    public ResponseEntity<BlogResponse> createPost(@RequestBody @Valid BlogRequest request) {
        return new ResponseEntity<>(blogService.createPost(request), HttpStatus.CREATED);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable String id) {
        blogService.deletePost(id);
        return ResponseEntity.noContent().build();
    }
}
