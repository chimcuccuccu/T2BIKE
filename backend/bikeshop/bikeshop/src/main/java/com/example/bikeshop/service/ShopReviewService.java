package com.example.bikeshop.service;

import com.example.bikeshop.dto.ShopReviewRequest;
import com.example.bikeshop.dto.ShopReviewResponse;
import com.example.bikeshop.entity.ShopReview;
import com.example.bikeshop.entity.User;
import com.example.bikeshop.repository.ShopReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ShopReviewService {
    @Autowired
    private ShopReviewRepository reviewRepository;

    public ShopReviewResponse createReview(ShopReviewRequest req, User user) {
        ShopReview review = new ShopReview();
        review.setComment(req.getComment());
        review.setRating(req.getRating());
        review.setUser(user);

        review = reviewRepository.save(review);
        return toResponse(review);
    }

    public List<ShopReviewResponse> getAllReviews() {
        return reviewRepository.findAll()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public ShopReviewResponse updateReview(Long id, ShopReviewRequest req, User user) {
        ShopReview review = reviewRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Review not found"));

        if (!review.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Not allowed");
        }

        review.setComment(req.getComment());
        review.setRating(req.getRating());

        return toResponse(reviewRepository.save(review));
    }

    public void deleteReview(Long id, User user) {
        ShopReview review = reviewRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Review not found"));

        if (!review.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Not allowed");
        }

        reviewRepository.delete(review);
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
}
