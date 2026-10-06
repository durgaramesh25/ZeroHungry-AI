package com.zerohungry.ai.controller;

import com.zerohungry.ai.model.Role;
import com.zerohungry.ai.model.User;
import com.zerohungry.ai.repository.UserRepository;
import com.zerohungry.ai.security.JwtService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final UserRepository userRepository;
    private final JwtService jwtService;

    private final BCryptPasswordEncoder passwordEncoder =
            new BCryptPasswordEncoder();

    public AuthController(
            UserRepository userRepository,
            JwtService jwtService) {

        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }

    // REGISTER
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {

        if (userRepository.existsByEmail(user.getEmail())) {
            return ResponseEntity.badRequest()
                    .body("Email already registered");
        }

        if (user.getRole() == null) {
            user.setRole(Role.DONOR);
        }

        user.setPassword(
                passwordEncoder.encode(user.getPassword())
        );

        User savedUser = userRepository.save(user);

        savedUser.setPassword(null);

        return ResponseEntity.status(201).body(savedUser);
    }

    // LOGIN
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User loginUser) {

        User existingUser = userRepository
                .findByEmail(loginUser.getEmail())
                .orElse(null);

        if (existingUser == null) {
            return ResponseEntity.status(401)
                    .body("Invalid email or password");
        }

        if (!passwordEncoder.matches(
                loginUser.getPassword(),
                existingUser.getPassword())) {

            return ResponseEntity.status(401)
                    .body("Invalid email or password");
        }

        // Generate JWT token
        String token = jwtService.generateToken(
                existingUser.getEmail(),
                existingUser.getRole().name()
        );

        return ResponseEntity.ok(
                new LoginResponse(
                        existingUser.getId(),
                        existingUser.getName(),
                        existingUser.getEmail(),
                        existingUser.getRole(),
                        token
                )
        );
    }

    // Response object for login
    public static class LoginResponse {

        private Long id;
        private String name;
        private String email;
        private Role role;
        private String token;

        public LoginResponse(
                Long id,
                String name,
                String email,
                Role role,
                String token) {

            this.id = id;
            this.name = name;
            this.email = email;
            this.role = role;
            this.token = token;
        }

        public Long getId() {
            return id;
        }

        public String getName() {
            return name;
        }

        public String getEmail() {
            return email;
        }

        public Role getRole() {
            return role;
        }

        public String getToken() {
            return token;
        }
    }
}