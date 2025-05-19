package com.example.bikeshop.service;

import com.example.bikeshop.dto.ShopReviewRequest;
import com.example.bikeshop.dto.ShopReviewResponse;
import com.example.bikeshop.dto.ShopReviewStatsDTO;
import com.example.bikeshop.entity.ShopReview;
import com.example.bikeshop.entity.User;
import com.example.bikeshop.repository.ShopReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ShopReviewService {
    @Autowired
    private ShopReviewRepository reviewRepository;
    @Autowired
    private ShopReviewRepository shopReviewRepository;

    public ShopReviewResponse createReview(ShopReviewRequest req, User user) {
        ShopReview review = new ShopReview();
        review.setComment(req.getComment());
        review.setRating(req.getRating());
        review.setUser(user);

        review = reviewRepository.save(review);
        return toResponse(review);
    }

    public Page<ShopReviewResponse> getAllReviews(int page, int size) {
        Page<ShopReview> reviewPage = reviewRepository.findAll(PageRequest.of(page, size));
        return reviewPage.map(review -> new ShopReviewResponse(
                review.getId(),
                review.getComment(),
                review.getRating(),
                review.getUser().getUsername(),
                review.getCreatedAt(),
                review.getUser().getId()

        ));
    }


    public ShopReviewResponse updateReview(Long id, ShopReviewRequest req, User user) {
        ShopReview review = reviewRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Review not found"));

        if (!review.getUser().getId().equals(user.getId()) && !user.getRole().equalsIgnoreCase("admin")) {
            throw new RuntimeException("Not allowed");
        }

        review.setComment(req.getComment());
        review.setRating(req.getRating());

        return toResponse(reviewRepository.save(review));
    }

    public void deleteReview(Long id, User user) {
        ShopReview review = reviewRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Review not found"));

        if (!review.getUser().getId().equals(user.getId()) && !user.getRole().equalsIgnoreCase("admin")) {
            throw new RuntimeException("Not allowed");
        }

        reviewRepository.delete(review);
    }

    public List<ShopReviewResponse> getReviewsByUser(Long userId) {
        List<ShopReview> reviews = reviewRepository.findByUserId(userId);
        return reviews.stream()
                .map(review -> new ShopReviewResponse(review))
                .collect(Collectors.toList());
    }

    public Double getAverageRating() {
        Double avgRating = reviewRepository.findAverageRating();
        return avgRating != null ? avgRating : 0.0;
    }

    public boolean hasReviewed(Long userId) {
        return reviewRepository.existsByUserId(userId);
    }


    private ShopReviewResponse toResponse(ShopReview review) {
        ShopReviewResponse res = new ShopReviewResponse();
        res.setId(review.getId());
        res.setComment(review.getComment());
        res.setRating(review.getRating());
        res.setReviewerName(review.getUser().getFullName());
        res.setCreatedAt(review.getCreatedAt());
        return res;
    }

    public boolean isReviewOwner(Long reviewId, Long userId) {
        return shopReviewRepository.existsByIdAndUserId(reviewId, userId);
    }

    public ShopReviewStatsDTO getReviewStats() {
        Double avg = shopReviewRepository.findAverageRating();
        double average = avg != null ? Math.round(avg * 10.0) / 10.0 : 0.0;

        List<Object[]> counts = shopReviewRepository.findRatingCounts();
        Map<Integer, Long> starCounts = new HashMap<>();
        for (int i = 1; i <= 5; i++) {
            starCounts.put(i, 0L);
        }

        for (Object[] row : counts) {
            Integer rating = (Integer) row[0];
            Long count = (Long) row[1];
            starCounts.put(rating, count);
        }

        long totalReviews = starCounts.values().stream().mapToLong(Long::longValue).sum();

        return new ShopReviewStatsDTO(average, totalReviews, starCounts);
    }
}
