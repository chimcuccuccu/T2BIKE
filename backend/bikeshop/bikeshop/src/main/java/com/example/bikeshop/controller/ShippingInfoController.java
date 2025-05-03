package com.example.bikeshop.controller;

import com.example.bikeshop.dto.ShippingInfoDTO;
import com.example.bikeshop.dto.ShippingInfoRequest;
import com.example.bikeshop.service.ShippingInfoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/shipping-info")
public class ShippingInfoController {

    @Autowired
    private ShippingInfoService shippingInfoService;

    // 1. Thêm thông tin giao hàng
    @PostMapping
    public ResponseEntity<ShippingInfoDTO> addShippingInfo(@RequestBody ShippingInfoRequest shippingInfoRequest) {
        ShippingInfoDTO shippingInfoDTO = shippingInfoService.addShippingInfo(shippingInfoRequest);
        return new ResponseEntity<>(shippingInfoDTO, HttpStatus.CREATED);
    }

    // 2. Lấy thông tin giao hàng theo order_id
    @GetMapping("/{orderId}")
    public ResponseEntity<ShippingInfoDTO> getShippingInfo(@PathVariable Long orderId) {
        ShippingInfoDTO shippingInfoDTO = shippingInfoService.getShippingInfoByOrderId(orderId);
        if (shippingInfoDTO != null) {
            return new ResponseEntity<>(shippingInfoDTO, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    // 3. Cập nhật thông tin giao hàng
    @PutMapping("/{id}")
    public ResponseEntity<ShippingInfoDTO> updateShippingInfo(@PathVariable Long id, @RequestBody ShippingInfoRequest shippingInfoRequest) {
        ShippingInfoDTO shippingInfoDTO = shippingInfoService.updateShippingInfo(id, shippingInfoRequest);
        if (shippingInfoDTO != null) {
            return new ResponseEntity<>(shippingInfoDTO, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    // 4. Xóa thông tin giao hàng
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteShippingInfo(@PathVariable Long id) {
        boolean deleted = shippingInfoService.deleteShippingInfo(id);
        if (deleted) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    // 5. Lấy tất cả thông tin giao hàng
    @GetMapping
    public ResponseEntity<List<ShippingInfoDTO>> getAllShippingInfo() {
        List<ShippingInfoDTO> shippingInfoList = shippingInfoService.getAllShippingInfo();
        return new ResponseEntity<>(shippingInfoList, HttpStatus.OK);
    }
}
