package com.example.bikeshop.controller;

import com.example.bikeshop.dto.ShopReviewRequest;
import com.example.bikeshop.dto.ShopReviewResponse;
import com.example.bikeshop.entity.User;
import com.example.bikeshop.repository.UserRepository;
import com.example.bikeshop.service.ShopReviewService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/shop-reviews")
public class ShopReviewController {

    @Autowired
    private ShopReviewService reviewService;

    @Autowired
    private UserRepository userRepository;

    @PostMapping
    public ResponseEntity<?> createReview(@RequestBody ShopReviewRequest req, HttpSession session) {
        Long userId = (Long) session.getAttribute("userId");
        if (userId == null) {
            return ResponseEntity.status(401).body("Bạn cần đăng nhập để đánh giá.");
        }
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));
        return ResponseEntity.ok(reviewService.createReview(req, user));
    }

    @GetMapping
    public List<ShopReviewResponse> getAllReviews() {
        return reviewService.getAllReviews();
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateReview(@PathVariable Long id, @RequestBody ShopReviewRequest req, HttpSession session) {
        Long userId = (Long) session.getAttribute("userId");
        if (userId == null) {
            return ResponseEntity.status(401).body("Bạn cần đăng nhập để chỉnh sửa đánh giá.");
        }
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

        return ResponseEntity.ok(reviewService.updateReview(id, req, user));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteReview(@PathVariable Long id, HttpSession session) {
        Long userId = (Long) session.getAttribute("userId");
        if (userId == null) {
            return ResponseEntity.status(401).body("Bạn cần đăng nhập để xóa đánh giá.");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

        reviewService.deleteReview(id, user);
        return ResponseEntity.ok("Đánh giá đã được xóa thành công.");
    }

}

