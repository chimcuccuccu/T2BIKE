package com.example.bikeshop.controller;

import com.example.bikeshop.dto.ShopReviewRequest;
import com.example.bikeshop.dto.ShopReviewResponse;
import com.example.bikeshop.dto.ShopReviewStatsDTO;
import com.example.bikeshop.entity.User;
import com.example.bikeshop.repository.UserRepository;
import com.example.bikeshop.service.ShopReviewService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
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

        boolean alreadyReviewed = reviewService.hasReviewed(userId);

        if (alreadyReviewed) {
            return ResponseEntity.status(400).body("Bạn đã đánh giá cửa hàng rồi.");
        }

        return ResponseEntity.ok(reviewService.createReview(req, user));
    }

    @GetMapping("/user")
    public ResponseEntity<?> getReviewsByUser(HttpSession session) {
        Long userId = (Long) session.getAttribute("userId");
        if (userId == null) {
            return ResponseEntity.status(401).body("Bạn cần đăng nhập để xem đánh giá của mình.");
        }
        return ResponseEntity.ok(reviewService.getReviewsByUser(userId));
    }

    @GetMapping("/average-rating")
    public ResponseEntity<Double> getAverageRating() {
        return ResponseEntity.ok(reviewService.getAverageRating());
    }

    @GetMapping
    public Page<ShopReviewResponse> getAllReviews(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size
    ) {
        return reviewService.getAllReviews(page, size);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateReview(@PathVariable Long id, @RequestBody ShopReviewRequest req, HttpSession session) {
        Long userId = (Long) session.getAttribute("userId");
        if (userId == null) {
            return ResponseEntity.status(401).body("Bạn cần đăng nhập để chỉnh sửa đánh giá.");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

        if (!"admin".equals(user.getRole()) && !reviewService.isReviewOwner(id, userId)) {
            return ResponseEntity.status(403).body("Bạn không có quyền chỉnh sửa đánh giá này.");
        }

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

        if (!"admin".equals(user.getRole()) && !reviewService.isReviewOwner(id, userId)) {
            return ResponseEntity.status(403).body("Bạn không có quyền xóa đánh giá này.");
        }

        reviewService.deleteReview(id, user);
        return ResponseEntity.ok("Đánh giá đã được xóa thành công.");
    }

    @GetMapping("/stats")
    public ResponseEntity<ShopReviewStatsDTO> getStats() {
        return ResponseEntity.ok(reviewService.getReviewStats());
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchReviews(
            @RequestParam(required = false) Integer rating,
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size
    ) {
        return ResponseEntity.ok(reviewService.searchReviews(rating, keyword, PageRequest.of(page, size)));
    }
}

