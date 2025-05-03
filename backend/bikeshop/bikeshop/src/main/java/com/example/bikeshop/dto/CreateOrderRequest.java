package com.example.bikeshop.dto;

import com.example.bikeshop.entity.ShippingInfo;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class CreateOrderRequest {
    private String customerName;
    private List<ItemRequest> items;
    private ShippingInfoRequest shippingInfo;

    @Getter
    @Setter
    public static class ItemRequest {
        private Long productId;
        private int quantity;
    }

}
