package com.example.bikeshop.controller;

import com.example.bikeshop.dto.ProductDTO;
import com.example.bikeshop.entity.Image;
import com.example.bikeshop.entity.Product;
import com.example.bikeshop.entity.User;
import com.example.bikeshop.repository.UserRepository;
import com.example.bikeshop.service.CloudinaryService;
import com.example.bikeshop.service.ImageService;
import com.example.bikeshop.service.ProductService;
import com.example.bikeshop.specification.ProductSpecification;
import jakarta.servlet.http.HttpSession;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Map;

@RestController
@RequestMapping("/api/all-products")
@AllArgsConstructor
public class ProductController {
    @Autowired
    private ProductService productService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    CloudinaryService cloudinaryService;

    @Autowired
    ImageService imageService;

    @GetMapping
    public ResponseEntity<Page<Product>> getAllProduct(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "9") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(productService.getAllProduct(pageable));
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<Page<Product>> getProductsByCategory(
            @PathVariable String category,
            @PageableDefault(size = 9) Pageable pageable) {
        return ResponseEntity.ok(productService.getProductsByCategory(category, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> createProductWithImages(
            @RequestPart("product") ProductDTO productDTO,
            @RequestPart("images") MultipartFile[] images,
            HttpSession session) throws IOException {
        Long userId = (Long) session.getAttribute("userId");
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Vui lòng đăng nhập");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

        if (!"admin".equals(user.getRole())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Bạn không có quyền thêm sản phẩm");
        }

        ProductDTO savedProductDTO = productService.save(productDTO);

        Product savedProductEntity = productService.getProductById(savedProductDTO.getId());

        List<String> uploadedUrls = new ArrayList<>();
        for (MultipartFile file : images) {
            BufferedImage bi = ImageIO.read(file.getInputStream());
            if (bi == null) {
                return new ResponseEntity<>("File không hợp lệ", HttpStatus.BAD_REQUEST);
            }

            Map<String, Object> result = cloudinaryService.upload(file);

            Image image = new Image(
                    (String) result.get("original_filename"),
                    (String) result.get("url"),
                    (String) result.get("public_id"));
            image.setProduct(savedProductEntity);
            imageService.save(image);

            uploadedUrls.add((String) result.get("url"));
        }

        savedProductEntity.setImageUrls(uploadedUrls);

        productService.saveEntity(savedProductEntity);

        return ResponseEntity.ok(Map.of(
                "message", "Tạo sản phẩm thành công",
                "product", savedProductDTO,
                "uploadedImages", uploadedUrls));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id, @RequestBody Product product) {
        return ResponseEntity.ok(productService.updateProduct(id, product));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id, HttpSession session) {
        Long userId = (Long) session.getAttribute("userId");
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Vui lòng đăng nhập");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

        if (!"admin".equals(user.getRole())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Bạn không có quyền xóa sản phẩm");
        }

        try {
            productService.deleteProduct(id);
            return ResponseEntity.ok("Đã xóa sản phẩm với ID: " + id);
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Không tìm thấy sản phẩm với ID: " + id);
        }
    }

    @GetMapping("/filter")
    public ResponseEntity<Page<Product>> filterProducts(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String brand,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            @PageableDefault(size = 10) Pageable pageable) {

        return ResponseEntity.ok(productService.filterProducts(category, brand, minPrice, maxPrice, pageable));
    }

    @GetMapping("/search")
    public ResponseEntity<Page<Product>> searchProducts(
            @RequestParam("keyword") String keyword,
            @PageableDefault(size = 9) Pageable pageable) {

        return ResponseEntity.ok(productService.searchProducts(keyword, pageable));
    }

}