package com.example.bikeshop.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserOrderStatsDTO {
    private Long totalOrders;
    private Double totalAmountSpent;
}
