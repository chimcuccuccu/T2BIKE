package com.example.bikeshop.service;

import com.example.bikeshop.dto.WishlistItemViewDTO;
import com.example.bikeshop.dto.WishlistResponseDTO;
import com.example.bikeshop.entity.Product;
import com.example.bikeshop.entity.User;
import com.example.bikeshop.entity.WishlistItem;
import com.example.bikeshop.repository.ProductRepository;
import com.example.bikeshop.repository.UserRepository;
import com.example.bikeshop.repository.WishlistRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class WishlistService {

    @Autowired
    private WishlistRepository wishlistRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    public WishlistResponseDTO getWishlistByUserId(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User không tồn tại"));

        List<WishlistItem> wishlistItems = wishlistRepository.findByUserId(userId);

        List<WishlistItemViewDTO> itemDTOs = wishlistItems.stream().map(item -> {
            Product product = item.getProduct();
            return new WishlistItemViewDTO(
                    product.getName(),
                    1, // mặc định 1
                    product.getPrice()
            );
        }).collect(Collectors.toList());

        return new WishlistResponseDTO(user.getFullName(), itemDTOs);
    }

    public String addToWishlist(Long userId, Long productId) {
        Optional<WishlistItem> existing = wishlistRepository.findByUserIdAndProductId(userId, productId);
        if (existing.isPresent()) {
            return "⚠️ Sản phẩm đã có trong danh sách yêu thích";
        }

        User user = userRepository.findById(userId).orElseThrow();
        Product product = productRepository.findById(productId).orElseThrow();

        WishlistItem item = new WishlistItem();
        item.setUser(user);
        item.setProduct(product);
        wishlistRepository.save(item);

        return "✅ Đã thêm vào danh sách yêu thích";
    }

    public void removeFromWishlist(Long itemId) {
        wishlistRepository.deleteById(itemId);
    }
}