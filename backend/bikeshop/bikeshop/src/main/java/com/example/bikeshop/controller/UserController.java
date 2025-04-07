package com.example.bikeshop.controller;

import com.example.bikeshop.dto.UserDTO;
import com.example.bikeshop.entity.User;
import com.example.bikeshop.repository.UserRepository;
import com.example.bikeshop.service.UserService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Controller
@RequestMapping("/api/users")
public class UserController {
    @Autowired
    private UserService userService;
    @Autowired
    private UserRepository userRepository;

    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody UserDTO userDTO) {
        try {
            if (userDTO.getUsername() == null || userDTO.getUsername().isEmpty()) {
                return ResponseEntity.badRequest().body("Username không được để trống");
            }
            userService.registerUser(userDTO);
            return ResponseEntity.ok("User created");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi server: " + e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody UserDTO userDTO, HttpServletResponse response) {
        try {
            User user = userService.login(userDTO.getUsername(), userDTO.getPassword());
            if (user != null) {
                // Tạo cookie chứa thông tin đăng nhập (JWT hoặc một giá trị nhận dạng khác)
                Cookie cookie = new Cookie("authToken", user.getUsername()); // Ví dụ với username
                cookie.setHttpOnly(true); // Đảm bảo cookie chỉ có thể truy cập từ server (bảo mật)
                cookie.setMaxAge(3600); // Đặt thời gian sống của cookie
                cookie.setPath("/"); // Đặt path của cookie để nó có thể truy cập ở tất cả các trang
                response.addCookie(cookie);

                return ResponseEntity.ok(user);
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Sai tài khoản hoặc mật khẩu"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "Lỗi: " + e.getMessage()));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse response) {
        // Xóa cookie
        Cookie cookie = new Cookie("authToken", null); // Thiết lập giá trị cookie là null để xóa
        cookie.setMaxAge(0); // Đặt thời gian sống của cookie về 0 để xóa
        cookie.setPath("/"); // Đảm bảo cookie có thể xóa trên toàn bộ ứng dụng
        response.addCookie(cookie);

        return ResponseEntity.ok("Đăng xuất thành công");
    }

    @GetMapping("/{username}")
    public ResponseEntity<User> getUser(@PathVariable String username) {
        Optional<User> user = userService.getUserByUsername(username);
        return user.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    // Kiểm tra thông tin user hiện tại trong session
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(HttpSession session) {
        // Kiểm tra xem session có chứa user hay không
        Object userObj = session.getAttribute("user");
        if (userObj == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Chưa đăng nhập");
        }

        User user = (User) userObj;
        return ResponseEntity.ok(user); // Trả về thông tin người dùng
    }
}
