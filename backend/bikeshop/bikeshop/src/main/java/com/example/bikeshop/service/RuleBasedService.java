package com.example.bikeshop.service;

import org.springframework.stereotype.Service;

@Service
public class RuleBasedService {

    public String checkRule(String message) {
        message = message.toLowerCase();

        if (message.contains("ship")) {
            return "Shop hỗ trợ giao hàng toàn quốc, phí ship sẽ tùy khu vực 🚚";
        }

        if (message.contains("bảo hành")) {
            return "Xe được bảo hành 3 tháng, hỗ trợ bảo dưỡng trọn đời 🔧";
        }

        if (message.contains("người mới")) {
            return "Người mới nên chọn xe MTB hoặc Touring, dễ đi và bền 👍";
        }

        return null; // không match rule
    }
}

