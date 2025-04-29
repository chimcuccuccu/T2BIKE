package com.example.bikeshop.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class WishlistItemViewDTO {
    private String productName;
    private int quantity;
    private double price;

    public WishlistItemViewDTO(String productName, int quantity, double price) {
        this.productName = productName;
        this.quantity = quantity;
        this.price = price;
    }
}
