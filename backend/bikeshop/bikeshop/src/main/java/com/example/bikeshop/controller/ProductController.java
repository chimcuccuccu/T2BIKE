package com.example.bikeshop.controller;

import com.example.bikeshop.entity.Product;
import com.example.bikeshop.service.ProductService;
import com.example.bikeshop.specification.ProductSpecification;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/all-products")
@AllArgsConstructor
public class ProductController {
    @Autowired
    private ProductService productService;

    @GetMapping
    public List<Product> getAllProduct() {
        return productService.getAllProduct();
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<Product>> getProductsByCategory(@PathVariable String category) {
        return ResponseEntity.ok(productService.getProductsByCategory(category));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }

    @PostMapping
    public ResponseEntity<Product> createProduct(@RequestBody Product product) {
        return ResponseEntity.ok(productService.createProduct(product));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id, @RequestBody Product product) {
        return ResponseEntity.ok(productService.updateProduct(id, product));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/filter")
    public ResponseEntity<List<Product>> filterProducts(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String brand,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice) {
        List<Product> products = productService.filterProducts(category, brand, minPrice, maxPrice);
        return ResponseEntity.ok(products);
    }

    @GetMapping("/category/{category}/filter")
    public ResponseEntity<List<Product>> filterProducts(
            @PathVariable String category,
            @RequestParam(required = false) String brand,
            @RequestParam(required = false, defaultValue = "0") double minPrice,
            @RequestParam(required = false, defaultValue = "999999999") double maxPrice) {

        List<Product> products = productService.filterProducts(category, brand, minPrice, maxPrice);
        return ResponseEntity.ok(products);
    }

    @GetMapping("/search")
    public ResponseEntity<List<Product>> searchProducts (@RequestParam("keyword") String keyword) {
        List<Product> results = productService.searchProducts(keyword);
        return ResponseEntity.ok(results);
    }
}