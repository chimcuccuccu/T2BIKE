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
import org.springframework.data.domain.Pageable;
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
                review.getProduct().getName(),
                review.getAnswer(),
                review.getAnsweredAt(),
                review.getUser().getId()
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
                        r.getProduct().getName(),
                        r.getAnswer(),
                        r.getAnsweredAt(),
                        r.getUser().getId()))
                .collect(Collectors.toList());
    }

    public void deleteReview(Long reviewId, Long userId) {
        ProductReview review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đánh giá"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

        if (!review.getUser().getId().equals(userId) && !"admin".equalsIgnoreCase(user.getRole())) {
            throw new RuntimeException("Không có quyền xoá đánh giá này");
        }

        reviewRepository.delete(review);
    }


    public void updateReview(Long reviewId, ProductReviewRequestDTO request, Long userId) {
        ProductReview review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đánh giá"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

        // Check quyền: nếu không phải chủ review và không phải admin thì lỗi
        if (!review.getUser().getId().equals(userId) && !"admin".equalsIgnoreCase(user.getRole())) {
            throw new RuntimeException("Không có quyền sửa đánh giá này");
        }

        review.setComment(request.getComment());
        reviewRepository.save(review);
    }


    public void answerReview(Long reviewId, String answer, Long adminId) {
        User admin = userRepository.findById(adminId)
                .orElseThrow(() -> new RuntimeException("Admin không tồn tại"));

        if (!admin.getRole().equals("admin")) {
            throw new RuntimeException("Bạn không có quyền trả lời câu hỏi");
        }

        ProductReview review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Đánh giá không tồn tại"));

        review.setAnswer(answer);
        review.setAnsweredAt(LocalDateTime.now());
        reviewRepository.save(review);
    }

    // Sửa câu trả lời
    public void updateAnswer(Long reviewId, String newAnswer, Long adminId) {
        ProductReview review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đánh giá"));

        if (!review.getUser().getId().equals(adminId) &&
                !userRepository.findById(adminId).map(u -> u.getRole().equals("admin")).orElse(false)) {
            throw new RuntimeException("Không có quyền chỉnh sửa câu trả lời");
        }

        review.setAnswer(newAnswer);
        review.setAnsweredAt(LocalDateTime.now());
        reviewRepository.save(review);
    }

    // Xoá câu trả lời
    public void deleteAnswer(Long reviewId, Long adminId) {
        ProductReview review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đánh giá"));

        if (!userRepository.findById(adminId).map(u -> u.getRole().equals("admin")).orElse(false)) {
            throw new RuntimeException("Không có quyền xoá câu trả lời");
        }

        review.setAnswer(null);
        review.setAnsweredAt(null);
        reviewRepository.save(review);
    }

    // Lấy danh sách câu trả lời (có phân trang)
    public Page<ProductReviewResponse> getAllAnswers(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return reviewRepository.findByAnswerIsNotNull(pageable)
                .map(ProductReviewResponse::new);
    }

}

