package com.mk.portfolio.service;

import com.mk.portfolio.exception.ResourceNotFoundException;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class LocalMediaStorageService {

    public static final String STORAGE_KEY_PREFIX = "local:";

    @Value("${media.storage.path:/app/uploads}")
    private String storagePath;

    @Value("${media.public-base-url:http://localhost:8080}")
    private String publicBaseUrl;

    private Path rootPath;

    @PostConstruct
    void init() throws IOException {
        rootPath = Path.of(storagePath).toAbsolutePath().normalize();
        Files.createDirectories(rootPath);
    }

    public StoredMedia store(MultipartFile file) throws IOException {
        String extension = resolveExtension(file);
        String storedName = UUID.randomUUID() + extension;
        Path target = rootPath.resolve(storedName);
        Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);

        String baseUrl = publicBaseUrl.endsWith("/")
                ? publicBaseUrl.substring(0, publicBaseUrl.length() - 1)
                : publicBaseUrl;
        String url = baseUrl + "/api/portfolio/media/" + storedName;

        return new StoredMedia(url, STORAGE_KEY_PREFIX + storedName);
    }

    public Resource loadAsResource(String filename) throws MalformedURLException {
        Path file = rootPath.resolve(filename).normalize();
        if (!file.startsWith(rootPath) || !Files.exists(file)) {
            throw new ResourceNotFoundException("Media file not found: " + filename);
        }
        Resource resource = new UrlResource(file.toUri());
        if (!resource.exists() || !resource.isReadable()) {
            throw new ResourceNotFoundException("Media file not readable: " + filename);
        }
        return resource;
    }

    public MediaType resolveMediaType(String filename) {
        String lower = filename.toLowerCase();
        if (lower.endsWith(".mp4") || lower.endsWith(".webm") || lower.endsWith(".mov")) {
            return MediaType.parseMediaType("video/" + lower.substring(lower.lastIndexOf('.') + 1));
        }
        if (lower.endsWith(".png")) {
            return MediaType.IMAGE_PNG;
        }
        if (lower.endsWith(".gif")) {
            return MediaType.IMAGE_GIF;
        }
        if (lower.endsWith(".webp")) {
            return MediaType.parseMediaType("image/webp");
        }
        return MediaType.IMAGE_JPEG;
    }

    public void delete(String storageKey) throws IOException {
        if (storageKey == null || !storageKey.startsWith(STORAGE_KEY_PREFIX)) {
            return;
        }
        String filename = storageKey.substring(STORAGE_KEY_PREFIX.length());
        Files.deleteIfExists(rootPath.resolve(filename));
    }

    private String resolveExtension(MultipartFile file) {
        String original = file.getOriginalFilename();
        if (StringUtils.hasText(original) && original.contains(".")) {
            return original.substring(original.lastIndexOf('.')).toLowerCase();
        }
        if (file.getContentType() != null) {
            return switch (file.getContentType()) {
                case "image/png" -> ".png";
                case "image/gif" -> ".gif";
                case "image/webp" -> ".webp";
                case "video/mp4" -> ".mp4";
                case "video/webm" -> ".webm";
                case "video/quicktime" -> ".mov";
                default -> ".jpg";
            };
        }
        return ".jpg";
    }

    public record StoredMedia(String url, String storageKey) {}
}
