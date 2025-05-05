package com.example.bikeshop.service;

import com.example.bikeshop.dto.CreateOrderRequest;
import com.example.bikeshop.dto.ShippingInfoDTO;
import com.example.bikeshop.dto.ShippingInfoRequest;
import com.example.bikeshop.entity.*;
import com.example.bikeshop.repository.OrderRepository;
import com.example.bikeshop.repository.ProductRepository;
import com.example.bikeshop.repository.ShippingInfoRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class OrderService {
    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ShippingInfoRepository shippingInfoRepository;
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
        BigDecimal totalPrice = BigDecimal.ZERO;

        for (CreateOrderRequest.ItemRequest itemReq : request.getItems()) {
            Product product = productRepository.findById(itemReq.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found"));

            OrderItem item = new OrderItem();
            item.setOrder(order);
            item.setProduct(product);
            item.setQuantity(itemReq.getQuantity());
            item.setPriceAtOrder(product.getPrice());

            BigDecimal price = BigDecimal.valueOf(product.getPrice());
            BigDecimal itemTotal = price.multiply(BigDecimal.valueOf(itemReq.getQuantity()));

            totalPrice = totalPrice.add(itemTotal);

            items.add(item);
        }

        order.setItems(items);
        order.setTotalPrice(totalPrice);

        // 1. Lưu Order trước
        order = orderRepository.save(order);

        // 2. Tạo và lưu ShippingInfo
        ShippingInfoRequest shippingInfoRequest = request.getShippingInfo();
        ShippingInfo shippingInfo = new ShippingInfo();
        shippingInfo.setOrder(order);
        shippingInfo.setReceiverName(shippingInfoRequest.getReceiverName());
        shippingInfo.setPhone(shippingInfoRequest.getPhone());
        shippingInfo.setProvince(shippingInfoRequest.getProvince());
        shippingInfo.setDistrict(shippingInfoRequest.getDistrict());
        shippingInfo.setAddress(shippingInfoRequest.getAddress());
        shippingInfo.setNote(shippingInfoRequest.getNote());

        // Lưu ShippingInfo
        shippingInfoRepository.save(shippingInfo);

        order.setShippingInfo(shippingInfo);
        return order;
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
