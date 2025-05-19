package com.example.bikeshop.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.Map;

@Getter
@Setter
@AllArgsConstructor
public class ShopReviewStatsDTO {
    private double averageRating;
    private long totalReviews;
    private Map<Integer, Long> starCounts;
}
