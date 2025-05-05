package com.example.bikeshop.service;

import com.example.bikeshop.dto.AdminDashboardResponse;
import com.example.bikeshop.repository.OrderRepository;
import com.example.bikeshop.repository.ProductRepository;
import com.example.bikeshop.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AdminDashboardService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    public AdminDashboardResponse getDashboardData() {
        long totalProducts = productRepository.count();
        long totalOrders = orderRepository.count();
        long totalUsers = userRepository.count();
        Double totalRevenue = orderRepository.sumTotalRevenue();

        return new AdminDashboardResponse(
                totalProducts,
                totalOrders,
                totalRevenue != null ? totalRevenue : 0.0,
                totalUsers
        );
    }

    public double getRevenueByWeek(int week, int year) {
        Double revenue = orderRepository.getRevenueByWeek(week, year);
        return revenue != null ? revenue : 0.0;
    }

    public double getRevenueByMonth(int month, int year) {
        Double revenue = orderRepository.getRevenueByMonth(month, year);
        return revenue != null ? revenue : 0.0;
    }

    public double getRevenueByYear(int year) {
        Double revenue = orderRepository.getRevenueByYear(year);
        return revenue != null ? revenue : 0.0;
    }
}

