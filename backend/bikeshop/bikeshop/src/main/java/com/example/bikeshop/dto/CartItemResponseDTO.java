package com.example.bikeshop.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class CartItemResponseDTO {
    private Long id;
    private Long productId;
    private String productName;
    private int quantity;
    private Double price;
}
