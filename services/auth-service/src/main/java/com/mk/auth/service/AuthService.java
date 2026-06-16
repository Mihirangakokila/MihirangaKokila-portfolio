package com.mk.auth.service;

import com.mk.auth.dto.AuthRequest;
import com.mk.auth.dto.AuthResponse;
import com.mk.auth.model.Role;
import com.mk.auth.model.User;
import com.mk.auth.repository.UserRepository;
import com.mk.auth.security.JwtUtil;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    // Seed the Master Admin account on startup
    @PostConstruct
    public void initAdmin() {
        if (userRepository.findByUsername("mihiranga").isEmpty()) {
            User admin = User.builder()
                    .username("mihiranga")
                    .password(passwordEncoder.encode("admin123")) // Change in production!
                    .fullName("Mihiranga Kokila")
                    .role(Role.ADMIN)
                    .build();
            userRepository.save(admin);
            System.out.println("Master Admin account initialized.");
        }
    }

    public AuthResponse login(AuthRequest request) {
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("Invalid username or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid username or password");
        }

        String token = jwtUtil.generateToken(user.getUsername(), user.getRole().name());
        return new AuthResponse(token, "Bearer");
    }
}