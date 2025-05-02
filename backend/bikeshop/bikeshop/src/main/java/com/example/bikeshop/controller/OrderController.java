package com.example.bikeshop.controller;

import com.example.bikeshop.dto.CreateOrderRequest;
import com.example.bikeshop.entity.Order;
import com.example.bikeshop.entity.OrderStatus;
import com.example.bikeshop.entity.User;
import com.example.bikeshop.repository.UserRepository;
import com.example.bikeshop.service.OrderService;
import jakarta.annotation.PostConstruct;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {
    @PostConstruct
    public void init() {
        System.out.println(">>> OrderController loaded!");
    }

    @Autowired
    private OrderService orderService;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<Order>> getAllOrders() {
        List<Order> orders = orderService.getAllOrders();
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<?> getOrderById(@PathVariable Long orderId) {
        try {
            // Lấy thông tin đơn hàng theo orderId
            Order order = orderService.getOrderById(orderId);
            return ResponseEntity.ok(order);
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body("Không tìm thấy đơn hàng");
        }
    }

    @PostMapping
    public ResponseEntity<?> createOrder(@RequestBody CreateOrderRequest request, HttpSession session) {
        Long userId = (Long) session.getAttribute("userId");
        if (userId == null) {
            return ResponseEntity.status(401).body("Bạn cần đăng nhập để đặt hàng.");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

        Order order = orderService.createOrder(request, user);
        return ResponseEntity.ok(order);
    }

    @DeleteMapping("/{orderId}")
    public ResponseEntity<?> deleteOrder(@PathVariable Long orderId) {
        try {
            orderService.deleteOrder(orderId);
            return ResponseEntity.ok("Đơn hàng đã được xóa thành công");
        } catch (Exception e) {
            return ResponseEntity.status(404).body("Không tìm thấy đơn hàng");
        }
    }

    @PutMapping("/{orderId}")
    public ResponseEntity<?> updateOrder(@PathVariable Long orderId, @RequestBody Order updatedOrder) {
        try {
            Order order = orderService.updateOrder(orderId, updatedOrder);
            return ResponseEntity.ok(order);
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body("Không tìm thấy đơn hàng hoặc sản phẩm");
        }
    }

    @PutMapping("/{orderId}/status")
    public ResponseEntity<?> updateOrderStatus(@PathVariable Long orderId, @RequestParam String status) {
        System.out.println(">>>> ENTERED updateOrderStatus");
        System.out.println("Received orderId: " + orderId + " with status: " + status); // Debug log
        try {
            OrderStatus orderStatus = OrderStatus.valueOf(status.toUpperCase());
            Order updated = orderService.updateOrderStatus(orderId, orderStatus);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Trạng thái không hợp lệ");
        } catch (RuntimeException e) {
            System.out.println("Error: " + e.getMessage()); // Debug log error
            return ResponseEntity.status(404).body("Không tìm thấy đơn hàng với ID: " + orderId);
        }
    }
}
