package com.example.bikeshop.controller;

import com.example.bikeshop.dto.UserDTO;
import com.example.bikeshop.dto.UserOrderStatsDTO;
import com.example.bikeshop.entity.User;
import com.example.bikeshop.repository.UserRepository;
import com.example.bikeshop.service.OrderService;
import com.example.bikeshop.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OrderService orderService;

    // Lấy thông tin user hiện tại
    @GetMapping("/me")
    public ResponseEntity<User> getCurrentUser(Authentication authentication) {
        String username = authentication.getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(user);
    }

    // Cập nhật thông tin bản thân
    @PutMapping("/me")
    public ResponseEntity<?> updateSelf(@RequestBody UserDTO dto, Authentication authentication) {
        String username = authentication.getName();
        User currentUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        try {
            userService.updateUserInfo(currentUser.getId(), currentUser.getId(), dto);
            return ResponseEntity.ok("Cập nhật thông tin thành công");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        }
    }

    // Admin thêm user
    @PostMapping("/admin/add")
    public ResponseEntity<?> addUserByAdmin(@RequestBody UserDTO dto, Authentication authentication) {
        String username = authentication.getName();
        User adminUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        if (!"ADMIN".equalsIgnoreCase(adminUser.getRole())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Chỉ admin mới được thêm người dùng");
        }

        userService.registerUser(dto);
        return ResponseEntity.ok("Thêm người dùng thành công");
    }

    // Admin sửa thông tin user khác
    @PutMapping("/admin/{id}")
    public ResponseEntity<?> updateByAdmin(@PathVariable Long id, @RequestBody UserDTO dto, Authentication authentication) {
        String username = authentication.getName();
        User adminUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        if (!"ADMIN".equalsIgnoreCase(adminUser.getRole())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Chỉ admin mới được sửa người dùng");
        }

        userService.updateUserInfo(adminUser.getId(), id, dto);
        return ResponseEntity.ok("Admin cập nhật thông tin thành công");
    }

    // Admin xóa user
    @DeleteMapping("/admin/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id, Authentication authentication) {
        String username = authentication.getName();
        User adminUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        if (!"ADMIN".equalsIgnoreCase(adminUser.getRole())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Chỉ admin mới được xóa user");
        }

        userService.deleteUser(id);
        return ResponseEntity.ok("Xóa user thành công");
    }

    // Xem danh sách tất cả user (Admin)
    @GetMapping("/")
    public ResponseEntity<Page<User>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication authentication) {

        String username = authentication.getName();
        User adminUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        if (!"ADMIN".equalsIgnoreCase(adminUser.getRole())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        Page<User> users = userService.getAllUsers(page, size);
        return ResponseEntity.ok(users);
    }

    // Search user (Admin)
    @GetMapping("/search")
    public ResponseEntity<Page<User>> searchUsers(
            @RequestParam("keyword") String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication authentication) {

        String username = authentication.getName();
        User adminUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        if (!"ADMIN".equalsIgnoreCase(adminUser.getRole())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        Page<User> result = userService.searchUsers(keyword, page, size);
        return ResponseEntity.ok(result);
    }

    // Lấy thống kê đơn hàng của user
    @GetMapping("/{userId}/order-stats")
    public ResponseEntity<UserOrderStatsDTO> getUserOrderStats(@PathVariable Long userId, Authentication authentication) {
        // Bạn có thể cho phép admin xem tất cả hoặc user xem chính mình
        String username = authentication.getName();
        User currentUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!"ADMIN".equalsIgnoreCase(currentUser.getRole()) && !currentUser.getId().equals(userId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        UserOrderStatsDTO stats = orderService.getUserOrderStats(userId);
        return ResponseEntity.ok(stats);
    }
}
