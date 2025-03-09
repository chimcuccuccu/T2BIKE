package com.example.bikeshop.service;

import com.example.bikeshop.dto.ProductAttributeDTO;
import com.example.bikeshop.entity.Product;
import com.example.bikeshop.entity.ProductAttribute;
import com.example.bikeshop.repository.ProductAttributeRepository;
import com.example.bikeshop.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductAttributeService {
    @Autowired
    private ProductAttributeRepository productAttributeRepository;

    @Autowired
    private ProductRepository productRepository;

    public ProductAttributeDTO getProductAttributes(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm với ID: " + productId));
        List<ProductAttribute> attributes = productAttributeRepository.findByProductId(productId);
        return new ProductAttributeDTO(product, attributes);
    }
}
