package com.example.bikeshop.controller;

import com.example.bikeshop.dto.BicycleDetailDTO;
import com.example.bikeshop.dto.BicycleDetailRequest;
import com.example.bikeshop.service.BicycleDetailService;
import com.example.bikeshop.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/product-attributes")
public class BicycleDetailController {
    @Autowired
    private BicycleDetailService productDetailService;

    // Lấy tất cả product detail có phân trang
    @GetMapping("/details")
    public ResponseEntity<Page<BicycleDetailDTO>> getAllDetails(Pageable pageable) {
        Page<BicycleDetailDTO> details = productDetailService.getAllDetails(pageable);
        return new ResponseEntity<>(details, HttpStatus.OK);
    }

    // Lấy tất cả detail theo productId
    @GetMapping("/details/{productId}")
    public ResponseEntity<List<BicycleDetailDTO>> getDetailsByProductId(@PathVariable Long productId) {
        List<BicycleDetailDTO> details = productDetailService.getDetailsByProductId(productId);
        return new ResponseEntity<>(details, HttpStatus.OK);
    }

    // Thêm detail mới
    @PostMapping("/details")
    public ResponseEntity<BicycleDetailDTO> addDetail(@RequestBody BicycleDetailRequest dto) {
        BicycleDetailDTO newDetail = productDetailService.addDetail(dto);
        return new ResponseEntity<>(newDetail, HttpStatus.CREATED);
    }

    // Cập nhật detail
    @PutMapping("/details/{id}")
    public ResponseEntity<BicycleDetailDTO> updateDetail(@PathVariable Long id, @RequestBody BicycleDetailDTO dto) {
        BicycleDetailDTO updatedDetail = productDetailService.updateDetail(id, dto);
        return new ResponseEntity<>(updatedDetail, HttpStatus.OK);
    }

    // Xoá detail
    @DeleteMapping("/details/{id}")
    public ResponseEntity<Void> deleteDetail(@PathVariable Long id) {
        productDetailService.deleteDetail(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @DeleteMapping("/product-details/{productId}")
    public ResponseEntity<Void> deleteDetailByProductId(@PathVariable Long productId) {
        try {
            productDetailService.deleteDetailByProductId(productId);
            return ResponseEntity.noContent().build(); // Trả về 204 nếu xóa thành công
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null); // Trả về 404 nếu không tìm thấy chi tiết
        }
    }

}