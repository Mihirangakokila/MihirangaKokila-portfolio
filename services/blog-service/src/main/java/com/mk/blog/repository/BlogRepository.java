package com.mk.blog.repository;

import com.mk.blog.model.BlogPost;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BlogRepository extends MongoRepository<BlogPost, String> {
    Optional<BlogPost> findBySlug(String slug);
    List<BlogPost> findByIsPublishedTrueOrderByCreatedAtDesc();
    List<BlogPost> findAllByOrderByCreatedAtDesc();
    List<BlogPost> findByCategoryAndIsPublishedTrue(String category);
    List<BlogPost> findByTitleContainingIgnoreCaseOrContentContainingIgnoreCase(String titleQuery, String contentQuery);
}