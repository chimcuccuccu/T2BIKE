package com.example.bikeshop.service;

import com.example.bikeshop.dto.BicycleDetailDTO;
import com.example.bikeshop.entity.BicycleDetail;
import com.example.bikeshop.entity.Product;
import com.example.bikeshop.repository.BicycleDetailRepository;
import com.example.bikeshop.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BicycleDetailService {
    @Autowired
    private BicycleDetailRepository bicycleDetailRepository;

    @Autowired
    private ProductRepository productRepository;

    public BicycleDetailDTO getBicycleDetail(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm với ID: " + productId));
        List<BicycleDetail> attributes = bicycleDetailRepository.findByProductId(productId);
        return new BicycleDetailDTO(product, attributes);
    }
}
