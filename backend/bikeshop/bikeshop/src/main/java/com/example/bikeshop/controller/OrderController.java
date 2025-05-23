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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
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
    public ResponseEntity<Page<Order>> getAllOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir
    ) {
        Page<Order> orders = orderService.getAllOrdersPaginated(page, size, sortBy, sortDir);
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

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getOrdersByUserId(@PathVariable Long userId) {
        try {
            List<Order> orders = orderService.getOrdersByUserId(userId);
            return ResponseEntity.ok(orders);
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body("Không tìm thấy đơn hàng cho userId: " + userId);
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
    public ResponseEntity<?> updateOrder(
            @PathVariable Long orderId,
            @RequestBody CreateOrderRequest request
    ) {
        try {
            Order updatedOrder = orderService.updateOrder(orderId, request);
            return ResponseEntity.ok(updatedOrder);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
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

    @GetMapping("/search")
    public ResponseEntity<List<Order>> searchOrders(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String status) {

        OrderStatus orderStatus = null;
        if (status != null && !status.isEmpty()) {
            try {
                orderStatus = OrderStatus.valueOf(status.toUpperCase()); // chuyển từ String sang enum
            } catch (IllegalArgumentException e) {
                return ResponseEntity.badRequest().body(null); // Trả lỗi nếu status không hợp lệ
            }
        }

        List<Order> orders = orderService.searchOrders(keyword, String.valueOf(orderStatus));
        return ResponseEntity.ok(orders);
    }


}
