package com.example.bikeshop.controller;

import com.example.bikeshop.dto.AnswerProductRequest;
import com.example.bikeshop.dto.ProductReviewRequestDTO;
import com.example.bikeshop.dto.ProductReviewResponse;
import com.example.bikeshop.service.ProductReviewService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/product-reviews")
@RequiredArgsConstructor
public class ProductReviewController {
    @Autowired
    private ProductReviewService reviewService;

    @GetMapping
    public Page<ProductReviewResponse> getAllReviews(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "9") int size
    ) {
        return reviewService.getAllReviews(page, size);
    }

    @PostMapping
    public ResponseEntity<?> addReview(@RequestBody ProductReviewRequestDTO request, HttpSession session) {
        Long userId = (Long) session.getAttribute("userId");
        if (userId == null) return ResponseEntity.status(401).body("Chưa đăng nhập");

        reviewService.addReview(request, userId);
        return ResponseEntity.ok("Đã thêm đánh giá");
    }


    @GetMapping("/product/{productId}")
    public ResponseEntity<List<ProductReviewResponse>> getReviews(@PathVariable Long productId) {
        return ResponseEntity.ok(reviewService.getReviewsByProduct(productId));
    }

    @DeleteMapping("/{reviewId}")
    public ResponseEntity<?> deleteReview(@PathVariable Long reviewId, HttpSession session) {
        Long userId = (Long) session.getAttribute("userId");
        if (userId == null) return ResponseEntity.status(401).body("Chưa đăng nhập");

        reviewService.deleteReview(reviewId, userId);
        return ResponseEntity.ok("Đã xoá đánh giá");
    }

    @PutMapping("/{reviewId}")
    public ResponseEntity<?> updateReview(@PathVariable Long reviewId,
                                          @RequestBody ProductReviewRequestDTO request,
                                          HttpSession session) {
        Long userId = (Long) session.getAttribute("userId");
        if (userId == null) return ResponseEntity.status(401).body("Chưa đăng nhập");

        reviewService.updateReview(reviewId, request, userId);
        return ResponseEntity.ok("Đã cập nhật đánh giá");
    }

    @PostMapping("/answer/{reviewId}")
    public ResponseEntity<?> answerReview(@PathVariable Long reviewId,
                                          @RequestBody AnswerProductRequest request,
                                          HttpSession session) {
        Long adminId = (Long) session.getAttribute("userId");
        if (adminId == null) return ResponseEntity.status(401).body("Chưa đăng nhập");

        reviewService.answerReview(reviewId, request.getAnswer(), adminId);
        return ResponseEntity.ok("Đã trả lời câu hỏi");
    }

    @PutMapping("/answer/{reviewId}")
    public ResponseEntity<?> updateAnswer(@PathVariable Long reviewId,
                                          @RequestBody AnswerProductRequest request,
                                          HttpSession session) {
        Long adminId = (Long) session.getAttribute("userId");
        if (adminId == null) return ResponseEntity.status(401).body("Chưa đăng nhập");

        reviewService.updateAnswer(reviewId, request.getAnswer(), adminId);
        return ResponseEntity.ok("Đã cập nhật câu trả lời");
    }

    @DeleteMapping("/answer/{reviewId}")
    public ResponseEntity<?> deleteAnswer(@PathVariable Long reviewId, HttpSession session) {
        Long adminId = (Long) session.getAttribute("userId");
        if (adminId == null) return ResponseEntity.status(401).body("Chưa đăng nhập");

        reviewService.deleteAnswer(reviewId, adminId);
        return ResponseEntity.ok("Đã xoá câu trả lời");
    }

    @GetMapping("/answers")
    public Page<ProductReviewResponse> getAllAnswers(@RequestParam(defaultValue = "0") int page,
                                                     @RequestParam(defaultValue = "10") int size) {
        return reviewService.getAllAnswers(page, size);
    }
}

