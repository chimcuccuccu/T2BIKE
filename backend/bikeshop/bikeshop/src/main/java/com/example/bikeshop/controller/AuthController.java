package com.example.bikeshop.controller;

import com.example.bikeshop.dto.AuthResponseDTO;
import com.example.bikeshop.dto.UserDTO;
import com.example.bikeshop.entity.RefreshToken;
import com.example.bikeshop.entity.User;
import com.example.bikeshop.repository.RefreshTokenRepository;
import com.example.bikeshop.repository.UserRepository;
import com.example.bikeshop.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private RefreshTokenRepository refreshTokenRepository;

    // ---------------- REGISTER ----------------
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody UserDTO dto) {

        User user = new User();
        user.setUsername(dto.getUsername());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setRole("USER");
        user.setFullName(dto.getFullName());
        user.setEmail(dto.getEmail());
        user.setGender(dto.getGender());
        user.setBirthDate(dto.getBirthDate());
        user.setPhone(dto.getPhone());
        user.setAddress(dto.getAddress());

        userRepository.save(user);

        return ResponseEntity.ok("Register success");
    }

    // ---------------- LOGIN ----------------
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody UserDTO dto) {

        User user = userRepository.findByUsername(dto.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(dto.getPassword(), user.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Sai tài khoản hoặc mật khẩu"));
        }

        // Tạo access token ngắn hạn
        String accessToken = jwtUtil.generateToken(user);

        // Tạo refresh token dài hạn
        String refreshToken = jwtUtil.generateRefreshToken(user);

        // Lưu refresh token vào DB
        RefreshToken refresh = new RefreshToken();
        refresh.setToken(refreshToken);
        refresh.setUser(user);
        refresh.setExpiryDate(LocalDateTime.now().plusDays(7));
        refreshTokenRepository.save(refresh);

        return ResponseEntity.ok(new AuthResponseDTO(accessToken, refreshToken, user.getRole()));
    }

    // ---------------- REFRESH TOKEN ----------------
    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(@RequestBody Map<String, String> request) {

        String refreshToken = request.get("refreshToken");
        if (refreshToken == null || refreshToken.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Refresh token required"));
        }

        try {
            // Lấy username từ token
            String username = jwtUtil.getUsernameFromToken(refreshToken);

            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Kiểm tra refresh token có tồn tại trong DB
            RefreshToken refresh = refreshTokenRepository.findByToken(refreshToken)
                    .orElseThrow(() -> new RuntimeException("Refresh token not found"));

            // Kiểm tra hết hạn
            if (refresh.getExpiryDate().isBefore(LocalDateTime.now())) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("message", "Refresh token expired"));
            }

            // Tạo access token mới
            String newAccessToken = jwtUtil.generateToken(user);

            return ResponseEntity.ok(Map.of("accessToken", newAccessToken));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Invalid refresh token"));
        }
    }

    // ---------------- LOGOUT ----------------
    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestBody Map<String, String> request) {
        String refreshToken = request.get("refreshToken");
        if (refreshToken != null) {
            refreshTokenRepository.findByToken(refreshToken)
                    .ifPresent(refreshTokenRepository::delete);
        }
        return ResponseEntity.ok(Map.of("message", "Logout successful"));
    }

}
