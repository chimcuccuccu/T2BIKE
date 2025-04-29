package com.example.bikeshop.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AddWishlistRequest {
    private Long userId;
    private Long productId;
}
