package com.example.bikeshop.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class WishlistItemViewDTO {
    private Long id;           // ID của wishlist item (quan trọng để xóa)
    private Long productId;    // ID của product
    private String productName;
    private double price;
    private int quantity;

    public WishlistItemViewDTO(Long id, Long productId, String productName, double price, int quantity) {
        this.id = id;
        this.productId = productId;
        this.productName = productName;
        this.price = price;
        this.quantity = quantity;
    }
}
