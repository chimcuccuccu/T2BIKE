package com.example.bikeshop.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class AdminDashboardResponse {
    private long totalProducts;
    private long totalOrders;
    private double totalRevenue;
    private long totalUsers;
}
