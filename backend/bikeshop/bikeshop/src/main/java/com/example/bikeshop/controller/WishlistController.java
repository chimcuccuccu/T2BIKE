package com.example.bikeshop.controller;

import com.example.bikeshop.dto.AddWishlistRequest;
import com.example.bikeshop.dto.WishlistResponseDTO;
import com.example.bikeshop.entity.User;
import com.example.bikeshop.entity.WishlistItem;
import com.example.bikeshop.repository.UserRepository;
import com.example.bikeshop.service.WishlistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/wishlist")
public class WishlistController {

    @Autowired
    private WishlistService wishlistService;

    @GetMapping("/{userId}")
    public WishlistResponseDTO getWishlist(@PathVariable Long userId) {
        return wishlistService.getWishlistByUserId(userId);
    }

    @PostMapping("/add")
    public ResponseEntity<String> addToWishlist(@RequestBody AddWishlistRequest request) {
        String message = wishlistService.addToWishlist(request.getUserId(), request.getProductId());
        return ResponseEntity.ok(message);
    }


    @DeleteMapping("/delete/{itemId}")
    public ResponseEntity<String> removeFromWishlist(@PathVariable Long itemId) {
        wishlistService.removeFromWishlist(itemId);
        return ResponseEntity.ok("🗑️ Đã xóa khỏi danh sách yêu thích");
    }
}