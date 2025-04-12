package com.example.bikeshop.service;

import com.example.bikeshop.dto.CartItemResponseDTO;
import com.example.bikeshop.dto.CartResponseDTO;
import com.example.bikeshop.entity.CartItem;
import com.example.bikeshop.entity.Product;
import com.example.bikeshop.entity.User;
import com.example.bikeshop.repository.CartItemRepository;
import com.example.bikeshop.repository.ProductRepository;
import com.example.bikeshop.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CartService {
    @Autowired private CartItemRepository cartItemRepo;
    @Autowired private UserRepository userRepo;
    @Autowired private ProductRepository productRepo;

    public void addToCart(Long userId, Long productId, int quantity) {
        CartItem item = cartItemRepo.findByUserIdAndProductId(userId, productId)
                .orElseGet(() -> {
                    CartItem newItem = new CartItem();
                    newItem.setUser(userRepo.findById(userId).orElseThrow());
                    newItem.setProduct(productRepo.findById(productId).orElseThrow());
                    return newItem;
                });

        item.setQuantity(item.getQuantity() + quantity);
        cartItemRepo.save(item);
    }

    public CartResponseDTO getUserCart(Long userId) {
        List<CartItem> items = cartItemRepo.findByUserId(userId);
        String userName = items.isEmpty() ? "" : items.getFirst().getUser().getFullName();

        List<CartItemResponseDTO> itemDTOs = items.stream()
                .map(i -> new CartItemResponseDTO(
                        i.getProduct().getName(),
                        i.getQuantity(),
                        i.getProduct().getPrice()
                ))
                .toList();

        return new CartResponseDTO(userName, itemDTOs);
    }

    public void updateCartItem(Long cartItemId, int newQuantity) {
        CartItem item = cartItemRepo.findById(cartItemId).orElseThrow();
        item.setQuantity(newQuantity);
        cartItemRepo.save(item);
    }

    public void deleteCartItem(Long cartItemId) {
        cartItemRepo.deleteById(cartItemId);
    }

    public void clearCart(Long userId) {
        cartItemRepo.deleteByUserId(userId);
    }
}
