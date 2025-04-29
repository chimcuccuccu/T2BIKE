package com.example.bikeshop.controller;

import com.example.bikeshop.dto.CartItemRequestDTO;
import com.example.bikeshop.dto.CartItemResponseDTO;
import com.example.bikeshop.dto.CartResponseDTO;
import com.example.bikeshop.entity.CartItem;
import com.example.bikeshop.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
public class CartItemController {
    @Autowired private CartService cartService;

    @PostMapping("/add")
    public ResponseEntity<?> addToCart(@RequestBody CartItemRequestDTO request) {
        Long userId = request.getUserId();
        Long productId = request.getProductId();
        int quantity = request.getQuantity();

        cartService.addToCart(userId, productId, quantity);
        return ResponseEntity.ok("Đã thêm sản phẩm vào giỏ hàng");
    }


    @GetMapping("/{userId}")
    public ResponseEntity<CartResponseDTO> getCart(@PathVariable Long userId) {
        return ResponseEntity.ok(cartService.getUserCart(userId));
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateCart(@PathVariable Long id,
                                        @RequestParam int quantity) {
        cartService.updateCartItem(id, quantity);
        return ResponseEntity.ok("Cập nhật thành công");
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteItem(@PathVariable Long id) {
        cartService.deleteCartItem(id);
        return ResponseEntity.ok("Xóa thành công");
    }

    @DeleteMapping("/clear/{userId}")
    public ResponseEntity<?> clearCart(@PathVariable Long userId) {
        cartService.clearCart(userId);
        return ResponseEntity.ok("Đã xóa hết giỏ hàng");
    }

    // Endpoint đồng bộ giỏ hàng
    @PostMapping("/sync/{userId}")
    public void syncCart(@PathVariable Long userId, @RequestBody List<CartItem> items) {
        cartService.syncCart(userId, items);
    }
}
