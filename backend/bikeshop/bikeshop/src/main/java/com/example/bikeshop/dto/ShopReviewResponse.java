package com.example.bikeshop.dto;

import com.example.bikeshop.entity.ShopReview;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
public class ShopReviewResponse {
    private Long id;
    private String comment;
    private int rating;
    private String reviewerName;
    private LocalDateTime createdAt;

    public ShopReviewResponse() {

    }

    public ShopReviewResponse(ShopReview review) {
    }
}
