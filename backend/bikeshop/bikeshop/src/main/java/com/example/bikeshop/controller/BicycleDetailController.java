package com.example.bikeshop.controller;

import com.example.bikeshop.dto.BicycleDetailDTO;
import com.example.bikeshop.service.BicycleDetailService;
import com.example.bikeshop.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/product-attributes")
public class BicycleDetailController {
    @Autowired
    private BicycleDetailService bicycleDetailService;

    @GetMapping("/attributes/{productId}")
    public ResponseEntity<BicycleDetailDTO> getBicycleDetail(@PathVariable Long productId) {
        return ResponseEntity.ok(bicycleDetailService.getBicycleDetail(productId));
    }
}