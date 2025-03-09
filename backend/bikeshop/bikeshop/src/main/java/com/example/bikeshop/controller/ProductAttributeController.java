package com.example.bikeshop.controller;

import com.example.bikeshop.dto.ProductAttributeDTO;
import com.example.bikeshop.entity.ProductAttribute;
import com.example.bikeshop.service.ProductAttributeService;
import com.example.bikeshop.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/product-attributes")
public class ProductAttributeController {
    @Autowired
    private ProductAttributeService productAttributeService;

    @GetMapping("/attributes/{productId}")
    public ResponseEntity<ProductAttributeDTO> getProductAttributes(@PathVariable Long productId) {
        return ResponseEntity.ok(productAttributeService.getProductAttributes(productId));
    }
}
