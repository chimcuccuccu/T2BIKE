package com.example.bikeshop.service;

import com.example.bikeshop.dto.CreateOrderRequest;
import com.example.bikeshop.entity.*;
import com.example.bikeshop.repository.OrderRepository;
import com.example.bikeshop.repository.ProductRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class OrderService {
    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductRepository productRepository;

    public Order getOrderById(Long orderId) {
        return orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng"));
    }

    public Order createOrder(CreateOrderRequest request, User user) {
        Order order = new Order();
        order.setCustomerName(request.getCustomerName());
        order.setUser(user);
        order.setStatus(OrderStatus.PENDING);

        List<OrderItem> items = new ArrayList<>();

        for (CreateOrderRequest.ItemRequest itemReq : request.getItems()) {
            Product product = productRepository.findById(itemReq.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found"));

            OrderItem item = new OrderItem();
            item.setOrder(order);
            item.setProduct(product);
            item.setQuantity(itemReq.getQuantity());
            item.setPriceAtOrder(product.getPrice());

            items.add(item);
        }

        order.setItems(items);
        return orderRepository.save(order);
    }

    public Order updateOrder(Long orderId, Order updatedOrder) {
        Order existingOrder = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng"));

        existingOrder.setCustomerName(updatedOrder.getCustomerName());

        existingOrder.getItems().clear();

        for (OrderItem item : updatedOrder.getItems()) {
            Product product = productRepository.findById(item.getProduct().getId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm"));
            item.setOrder(existingOrder);
            item.setProduct(product);
            item.setPriceAtOrder(product.getPrice());
        }

        existingOrder.setItems(updatedOrder.getItems());

        return orderRepository.save(existingOrder);
    }

    public Order updateOrderStatus(Long orderId, OrderStatus status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng với ID: " + orderId));
        System.out.println("Current status: " + order.getStatus());  // Log hiện tại của trạng thái
        order.setStatus(status);
        System.out.println("Updated status: " + order.getStatus());  // Log trạng thái mới
        return orderRepository.save(order);
    }

    public void deleteOrder(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng"));

        orderRepository.delete(order);
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }
}
