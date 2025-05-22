package com.example.bikeshop.service;

import com.example.bikeshop.dto.ProductDTO;
import com.example.bikeshop.entity.Product;
import com.example.bikeshop.repository.ProductRepository;
import com.example.bikeshop.specification.ProductSpecification;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ProductService {
    @Autowired
    private ProductRepository productRepository;

    private HttpSession session;

    public Page<Product> getAllProduct(Pageable pageable) {
        return productRepository.findAll(pageable);
    }

    public Page<Product> getProductsByCategory(String category, Pageable pageable) {
        return productRepository.findByCategory(category, pageable);
    }

    public Product getProductById(Long id) {
        return productRepository.findById(id).orElseThrow(() -> new RuntimeException("Product not found"));
    }

    public List<Product> createProducts(List<Product> products) {
        return productRepository.saveAll(products);
    }

    public Product updateProduct(Long id, Product product) {
        Product existingProduct = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        existingProduct.setName(product.getName());
        existingProduct.setCategory(product.getCategory());
        existingProduct.setPrice(product.getPrice());
        existingProduct.setDescription(product.getDescription());
        existingProduct.setBrand(product.getBrand());
        existingProduct.setQuantity(product.getQuantity());
        existingProduct.setColor(product.getColor());
        existingProduct.setImageUrls(product.getImageUrls());
        return productRepository.save(existingProduct);
    }

    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Không tìm thấy sản phẩm với ID: " + id));
        productRepository.delete(product);
    }

    public Page<Product> filterProducts(String category, String brand, Double minPrice, Double maxPrice,
            Pageable pageable) {
        Specification<Product> spec = Specification.where(ProductSpecification.hasCategory(category))
                .and(ProductSpecification.hasBrand(brand))
                .and(ProductSpecification.hasPriceBetween(minPrice, maxPrice));

        return productRepository.findAll(spec, pageable);
    }

    public Page<Product> searchProducts(String keyword, Pageable pageable) {
        return productRepository.searchAllFields(keyword, pageable);
    }

    public ProductDTO save(ProductDTO dto) {
        Product product = new Product();
        product.setName(dto.getName());
        product.setDescription(dto.getDescription());
        product.setPrice(dto.getPrice());
        product.setCategory(dto.getCategory());
        product.setBrand(dto.getBrand());
        product.setQuantity(dto.getQuantity());
        product.setColor(Collections.singletonList(dto.getColor()));

        Product saved = productRepository.save(product);

        ProductDTO response = new ProductDTO();
        response.setId(saved.getId());
        response.setName(saved.getName());
        response.setDescription(saved.getDescription());
        response.setPrice(saved.getPrice());
        response.setCategory(saved.getCategory());
        response.setBrand(saved.getBrand());
        response.setQuantity(saved.getQuantity());
        response.setColor(String.valueOf(saved.getColor()));
        response.setImageUrls(saved.getImageUrls());

        return response;
    }

    public Product saveEntity(Product product) {
        return productRepository.save(product);
    }

}