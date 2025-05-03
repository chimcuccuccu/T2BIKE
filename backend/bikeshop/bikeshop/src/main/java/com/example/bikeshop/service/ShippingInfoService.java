package com.example.bikeshop.service;

import com.example.bikeshop.dto.ShippingInfoDTO;
import com.example.bikeshop.dto.ShippingInfoRequest;
import com.example.bikeshop.entity.ShippingInfo;
import com.example.bikeshop.repository.ShippingInfoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ShippingInfoService {
    @Autowired
    private ShippingInfoRepository shippingInfoRepository;

    // Thêm thông tin giao hàng
    public ShippingInfoDTO addShippingInfo(ShippingInfoRequest shippingInfoRequest) {
        ShippingInfo shippingInfo = new ShippingInfo();
        shippingInfo.setReceiverName(shippingInfoRequest.getReceiverName());
        shippingInfo.setPhone(shippingInfoRequest.getPhone());
        shippingInfo.setProvince(shippingInfoRequest.getProvince());
        shippingInfo.setDistrict(shippingInfoRequest.getDistrict());
        shippingInfo.setAddress(shippingInfoRequest.getAddress());
        shippingInfo.setNote(shippingInfoRequest.getNote());

        ShippingInfo savedShippingInfo = shippingInfoRepository.save(shippingInfo);

        return mapToDTO(savedShippingInfo);
    }

    // Lấy thông tin giao hàng theo orderId
    public ShippingInfoDTO getShippingInfoByOrderId(Long orderId) {
        Optional<ShippingInfo> shippingInfo = shippingInfoRepository.findByOrderId(orderId);
        return shippingInfo.map(this::mapToDTO).orElse(null);
    }

    // Cập nhật thông tin giao hàng
    public ShippingInfoDTO updateShippingInfo(Long id, ShippingInfoRequest shippingInfoRequest) {
        Optional<ShippingInfo> existingShippingInfo = shippingInfoRepository.findById(id);

        if (existingShippingInfo.isPresent()) {
            ShippingInfo shippingInfo = existingShippingInfo.get();
            shippingInfo.setReceiverName(shippingInfoRequest.getReceiverName());
            shippingInfo.setPhone(shippingInfoRequest.getPhone());
            shippingInfo.setProvince(shippingInfoRequest.getProvince());
            shippingInfo.setDistrict(shippingInfoRequest.getDistrict());
            shippingInfo.setAddress(shippingInfoRequest.getAddress());
            shippingInfo.setNote(shippingInfoRequest.getNote());

            ShippingInfo updatedShippingInfo = shippingInfoRepository.save(shippingInfo);

            return mapToDTO(updatedShippingInfo);
        }

        return null;
    }

    // Xóa thông tin giao hàng
    public boolean deleteShippingInfo(Long id) {
        Optional<ShippingInfo> shippingInfo = shippingInfoRepository.findById(id);
        if (shippingInfo.isPresent()) {
            shippingInfoRepository.delete(shippingInfo.get());
            return true;
        }
        return false;
    }

    // Lấy tất cả thông tin giao hàng
    public List<ShippingInfoDTO> getAllShippingInfo() {
        List<ShippingInfo> shippingInfoList = shippingInfoRepository.findAll();
        return shippingInfoList.stream().map(this::mapToDTO).toList();
    }

    // Chuyển đổi ShippingInfo thành ShippingInfoDTO
    private ShippingInfoDTO mapToDTO(ShippingInfo shippingInfo) {
        ShippingInfoDTO dto = new ShippingInfoDTO();
        dto.setId(shippingInfo.getId());
        dto.setReceiverName(shippingInfo.getReceiverName());
        dto.setPhone(shippingInfo.getPhone());
        dto.setProvince(shippingInfo.getProvince());
        dto.setDistrict(shippingInfo.getDistrict());
        dto.setAddress(shippingInfo.getAddress());
        dto.setNote(shippingInfo.getNote());
        return dto;
    }
}
