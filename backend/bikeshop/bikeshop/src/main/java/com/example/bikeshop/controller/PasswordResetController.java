package com.example.bikeshop.controller;

import com.example.bikeshop.entity.User;
import com.example.bikeshop.repository.UserRepository;
import com.example.bikeshop.service.PasswordResetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class PasswordResetController {

    @Autowired
    private PasswordResetService resetService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // 1. Yêu cầu gửi link reset
    @PostMapping("/request-reset")
    public ResponseEntity<?> requestReset(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String frontendUrl = body.get("frontendUrl"); // frontend sẽ hiển thị form reset password
        resetService.sendResetLink(email, frontendUrl);
        return ResponseEntity.ok(Map.of("message", "Link đặt lại mật khẩu đã được gửi vào email"));
    }

    // 2. Reset mật khẩu
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> body) {
        String token = body.get("token");
        String newPassword = body.get("newPassword");

        User user = resetService.validateToken(token);
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        resetService.deleteToken(token);

        return ResponseEntity.ok(Map.of("message", "Đổi mật khẩu thành công"));
    }
}
