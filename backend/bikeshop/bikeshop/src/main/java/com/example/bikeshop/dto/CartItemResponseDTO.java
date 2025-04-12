package com.example.bikeshop.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class CartItemResponseDTO {
    private String productName;
    private int quantity;
    private Double price;
}
