package com.example.bikeshop.dto;

import com.example.bikeshop.entity.ProductReview;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
public class ProductReviewResponse {
    private Long id;
    private String username;
    private String comment;
    private LocalDateTime createdAt;
    private String productName;
    private String answer;
    private LocalDateTime answeredAt;
    private Long userId;

    public ProductReviewResponse(ProductReview review) {
        this.id = review.getId();
        this.username = review.getUser().getUsername();
        this.comment = review.getComment();
        this.createdAt = review.getCreatedAt();
        this.productName = review.getProduct().getName();
        this.answer = review.getAnswer();
        this.answeredAt = review.getAnsweredAt();
        this.userId = review.getUser().getId();
    }
}
