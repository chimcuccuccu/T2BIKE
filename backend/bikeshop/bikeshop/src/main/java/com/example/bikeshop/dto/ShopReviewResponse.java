package com.example.bikeshop.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class ShopReviewResponse {
    private Long id;
    private String comment;
    private int rating;
    private String reviewerName;
    private LocalDateTime createdAt;
}
