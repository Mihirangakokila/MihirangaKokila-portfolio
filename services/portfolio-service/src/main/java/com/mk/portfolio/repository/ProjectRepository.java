package com.mk.portfolio.repository;

import com.mk.portfolio.model.Project;
import com.mk.portfolio.model.ProjectType;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectRepository extends MongoRepository<Project, String> {
    List<Project> findByType(ProjectType type);
    List<Project> findByCategory(String category);
}