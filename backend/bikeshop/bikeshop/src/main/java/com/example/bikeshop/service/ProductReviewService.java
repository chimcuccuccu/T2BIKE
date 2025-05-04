package com.example.bikeshop.service;

import com.example.bikeshop.dto.ProductReviewRequestDTO;
import com.example.bikeshop.dto.ProductReviewResponse;
import com.example.bikeshop.entity.Product;
import com.example.bikeshop.entity.ProductReview;
import com.example.bikeshop.entity.User;
import com.example.bikeshop.repository.ProductRepository;
import com.example.bikeshop.repository.ProductReviewRepository;
import com.example.bikeshop.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductReviewService {
    @Autowired
    private ProductReviewRepository reviewRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    public Page<ProductReviewResponse> getAllReviews(int page, int size) {
        Page<ProductReview> reviewPage = reviewRepository.findAll(PageRequest.of(page, size));
        return reviewPage.map(review -> new ProductReviewResponse(
                review.getId(),
                review.getUser().getUsername(),
                review.getComment(),
                review.getCreatedAt(),
                review.getProduct().getName()
        ));
    }

    public void addReview(ProductReviewRequestDTO request, Long userId) {
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

        ProductReview review = new ProductReview();
        review.setProduct(product);
        review.setUser(user);
        review.setComment(request.getComment());
        review.setCreatedAt(LocalDateTime.now());

        reviewRepository.save(review);
    }

    public List<ProductReviewResponse> getReviewsByProduct(Long productId) {
        List<ProductReview> reviews = reviewRepository.findByProductId(productId);
        return reviews.stream()
                .map(r -> new ProductReviewResponse(
                        r.getId(),
                        r.getUser().getUsername(),
                        r.getComment(),
                        r.getCreatedAt(),
                        r.getProduct().getName()))
                .collect(Collectors.toList());
    }

    public void deleteReview(Long reviewId, Long userId) {
        ProductReview review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đánh giá"));

        if (!review.getUser().getId().equals(userId)) {
            throw new RuntimeException("Không có quyền xoá đánh giá này");
        }

        reviewRepository.delete(review);
    }

    public void updateReview(Long reviewId, ProductReviewRequestDTO request, Long userId) {
        ProductReview review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đánh giá"));

        if (!review.getUser().getId().equals(userId)) {
            throw new RuntimeException("Không có quyền sửa đánh giá này");
        }

        review.setComment(request.getComment());
        reviewRepository.save(review);
    }
}

