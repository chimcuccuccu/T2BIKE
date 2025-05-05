package com.example.bikeshop.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class RevenueByTimeResponse {
    private String label;
    private BigDecimal totalRevenue;

    public RevenueByTimeResponse(String label, BigDecimal totalRevenue) {
        this.label = label;
        this.totalRevenue = totalRevenue;
    }
}
