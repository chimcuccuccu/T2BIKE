package com.example.bikeshop.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProductReviewRequestDTO {
    private Long productId;
    private String comment;
}
