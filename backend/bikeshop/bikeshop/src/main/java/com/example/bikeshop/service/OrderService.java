package com.example.bikeshop.service;

import com.example.bikeshop.dto.CreateOrderRequest;
import com.example.bikeshop.dto.ShippingInfoDTO;
import com.example.bikeshop.dto.ShippingInfoRequest;
import com.example.bikeshop.dto.UserOrderStatsDTO;
import com.example.bikeshop.entity.*;
import com.example.bikeshop.repository.OrderRepository;
import com.example.bikeshop.repository.ProductRepository;
import com.example.bikeshop.repository.ShippingInfoRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
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

    public Order updateOrder(Long orderId, CreateOrderRequest request) {
        // 1. Tìm đơn hàng cũ
        Order existingOrder = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng với ID: " + orderId));

        // 2. Cập nhật thông tin cơ bản
        existingOrder.setCustomerName(request.getCustomerName());

        // 3. Xoá item cũ
        existingOrder.getItems().clear();

        // 4. Thêm item mới
        List<OrderItem> updatedItems = new ArrayList<>();
        BigDecimal totalPrice = BigDecimal.ZERO;

        for (CreateOrderRequest.ItemRequest itemReq : request.getItems()) {
            Product product = productRepository.findById(itemReq.getProductId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm với ID: " + itemReq.getProductId()));

            OrderItem item = new OrderItem();
            item.setOrder(existingOrder);
            item.setProduct(product);
            item.setQuantity(itemReq.getQuantity());
            item.setPriceAtOrder(product.getPrice());

            BigDecimal itemTotal = BigDecimal.valueOf(product.getPrice())
                    .multiply(BigDecimal.valueOf(itemReq.getQuantity()));
            totalPrice = totalPrice.add(itemTotal);

            updatedItems.add(item);
        }

        existingOrder.setItems(updatedItems);
        existingOrder.setTotalPrice(totalPrice);

        // 5. Cập nhật thông tin vận chuyển nếu có
        ShippingInfoRequest shippingInfoRequest = request.getShippingInfo();
        ShippingInfo shippingInfo = existingOrder.getShippingInfo();
        if (shippingInfo != null) {
            shippingInfo.setReceiverName(shippingInfoRequest.getReceiverName());
            shippingInfo.setPhone(shippingInfoRequest.getPhone());
            shippingInfo.setProvince(shippingInfoRequest.getProvince());
            shippingInfo.setDistrict(shippingInfoRequest.getDistrict());
            shippingInfo.setAddress(shippingInfoRequest.getAddress());
            shippingInfo.setNote(shippingInfoRequest.getNote());
            shippingInfoRepository.save(shippingInfo);
        }

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

    public Page<Order> getAllOrdersPaginated(int page, int size, String sortBy, String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        return orderRepository.findAll(pageable);
    }

    public UserOrderStatsDTO getUserOrderStats(Long userId) {
        List<Object[]> results = orderRepository.getUserOrderStats(userId);
        if (results.isEmpty()) {
            return new UserOrderStatsDTO(0L, 0.0);
        }
        Object[] result = results.get(0);

        Long totalOrders = ((Number) result[0]).longValue();
        Double totalAmount = ((Number) result[1]).doubleValue();

        return new UserOrderStatsDTO(totalOrders, totalAmount);
    }

    public List<Order> getOrdersByUserId(Long userId) {
        List<Order> orders = orderRepository.findByUserId(userId);
        if (orders.isEmpty()) {
            throw new RuntimeException("Không có đơn hàng nào.");
        }
        return orders;
    }

    public List<Order> searchOrders(String keyword, String status) {
        OrderStatus orderStatus = null;
        if (status != null && !status.isBlank()) {
            try {
                orderStatus = OrderStatus.valueOf(status.toUpperCase());
            } catch (IllegalArgumentException e) {
                throw new RuntimeException("Invalid status value: " + status);
            }
        }
        return orderRepository.searchOrders(keyword, orderStatus);
    }

}
