package com.example.bikeshop.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class CreateOrderRequest {
    private String customerName;
    private List<ItemRequest> items;

    @Getter
    @Setter
    public static class ItemRequest {
        private Long productId;
        private int quantity;
    }

}
