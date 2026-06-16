package com.mk.portfolio.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CloudinaryService {

    private final Cloudinary cloudinary;

    public Map uploadMedia(MultipartFile file, String folder) throws IOException {
        String resourceType = file.getContentType() != null && file.getContentType().startsWith("video") 
                ? "video" 
                : "image";

        return cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap(
                "folder", "mk_portfolio/" + folder,
                "resource_type", resourceType
        ));
    }

    public void deleteMedia(String publicId, String type) throws IOException {
        String resourceType = "VIDEO".equalsIgnoreCase(type) ? "video" : "image";
        cloudinary.uploader().destroy(publicId, ObjectUtils.asMap("resource_type", resourceType));
    }
}