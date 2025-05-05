package com.example.bikeshop.controller;

import com.example.bikeshop.dto.AdminDashboardResponse;
import com.example.bikeshop.service.AdminDashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/dashboard")
public class AdminDashboardController {
    @Autowired
    private AdminDashboardService dashboardService;

    @GetMapping
    public ResponseEntity<AdminDashboardResponse> getDashboard() {
        return ResponseEntity.ok(dashboardService.getDashboardData());
    }

    @GetMapping("/revenue/week")
    public ResponseEntity<Double> getRevenueByWeek(@RequestParam int week, @RequestParam int year) {
        return ResponseEntity.ok(dashboardService.getRevenueByWeek(week, year));
    }

    @GetMapping("/revenue/month")
    public ResponseEntity<Double> getRevenueByMonth(@RequestParam int month, @RequestParam int year) {
        return ResponseEntity.ok(dashboardService.getRevenueByMonth(month, year));
    }

    @GetMapping("/revenue/year")
    public ResponseEntity<Double> getRevenueByYear(@RequestParam int year) {
        return ResponseEntity.ok(dashboardService.getRevenueByYear(year));
    }
}
