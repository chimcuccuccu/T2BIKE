package com.example.bikeshop.service;

import com.example.bikeshop.dto.BicycleDetailDTO;
import com.example.bikeshop.dto.BicycleDetailRequest;
import com.example.bikeshop.entity.BicycleDetail;
import com.example.bikeshop.entity.Product;
import com.example.bikeshop.repository.BicycleDetailRepository;
import com.example.bikeshop.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class BicycleDetailService {
    @Autowired
    private BicycleDetailRepository repository;

    @Autowired
    private ProductRepository productRepository;

    // Lấy tất cả product detail có phân trang
    public Page<BicycleDetailDTO> getAllDetails(Pageable pageable) {
        // Lấy tất cả BicycleDetail
        Page<BicycleDetail> detailsPage = repository.findAll(pageable);

        // Tạo Map để nhóm BicycleDetail theo productId
        Map<Long, List<BicycleDetail>> productDetailMap = new HashMap<>();

        for (BicycleDetail detail : detailsPage.getContent()) {
            productDetailMap.computeIfAbsent(detail.getProduct().getId(), k -> new ArrayList<>()).add(detail);
        }

        // Chuyển đổi Map thành danh sách BicycleDetailDTO
        List<BicycleDetailDTO> bicycleDetailDTOList = new ArrayList<>();

        for (Map.Entry<Long, List<BicycleDetail>> entry : productDetailMap.entrySet()) {
            // Tìm sản phẩm từ productId
            Product product = productRepository.findById(entry.getKey())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm"));

            // Tạo BicycleDetailDTO cho sản phẩm và các chi tiết liên quan
            BicycleDetailDTO bicycleDetailDTO = new BicycleDetailDTO(product, entry.getValue());

            bicycleDetailDTOList.add(bicycleDetailDTO);
        }

        // Trả về Page với các BicycleDetailDTO
        return new PageImpl<>(bicycleDetailDTOList, pageable, detailsPage.getTotalElements());
    }



    // Lấy tất cả detail theo productId
    public List<BicycleDetailDTO> getDetailsByProductId(Long productId) {
        List<BicycleDetail> details = repository.findByProductId(productId);

        // Nhóm các BicycleDetail theo productId
        Map<Long, List<BicycleDetail>> productDetailMap = details.stream()
                .collect(Collectors.groupingBy(detail -> detail.getProduct().getId()));

        // Tạo BicycleDetailDTO cho mỗi nhóm sản phẩm
        return productDetailMap.entrySet().stream()
                .map(entry -> {
                    Product product = productRepository.findById(entry.getKey())
                            .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm"));
                    return new BicycleDetailDTO(product, entry.getValue());
                })
                .collect(Collectors.toList());
    }


    // Thêm detail mới
    public BicycleDetailDTO addDetail(BicycleDetailRequest dto) {
        BicycleDetail detail = new BicycleDetail();
        detail.setAttributeName(dto.getAttributes().get(0).getAttributeName());
        detail.setAttributeValue(dto.getAttributes().get(0).getAttributeValue());

        // Lưu BicycleDetail
        BicycleDetail saved = repository.save(detail);

        // Lấy Product từ productId
        Product product = productRepository.findById(dto.getProductId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm"));

        // Nhóm BicycleDetail theo productId
        Map<Long, List<BicycleDetail>> productDetailMap = new HashMap<>();
        productDetailMap.put(product.getId(), List.of(saved));

        // Tạo BicycleDetailDTO cho sản phẩm mới và chi tiết vừa thêm
        return new BicycleDetailDTO(product, productDetailMap.get(product.getId()));
    }


    // Cập nhật detail
    public BicycleDetailDTO updateDetail(Long id, BicycleDetailDTO dto) {
        BicycleDetail detail = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy chi tiết"));

        // Cập nhật chi tiết
        detail.setAttributeName(dto.getAttributes().get(0).getAttributeName());
        detail.setAttributeValue(dto.getAttributes().get(0).getAttributeValue());

        // Lưu chi tiết đã cập nhật
        BicycleDetail updated = repository.save(detail);

        // Lấy Product từ productId
        Product product = productRepository.findById(dto.getProductId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm"));

        // Nhóm BicycleDetail theo productId
        Map<Long, List<BicycleDetail>> productDetailMap = new HashMap<>();
        productDetailMap.put(product.getId(), List.of(updated));

        // Trả về BicycleDetailDTO cho sản phẩm và chi tiết đã cập nhật
        return new BicycleDetailDTO(product, productDetailMap.get(product.getId()));
    }

    public void deleteDetail(Long id) {
        repository.deleteById(id);
    }
    public void deleteDetailByProductId(Long productId) {
        // Tìm tất cả chi tiết sản phẩm theo productId
        List<BicycleDetail> details = repository.findByProductId(productId);

        // Kiểm tra xem có chi tiết nào không
        if (details.isEmpty()) {
            throw new RuntimeException("Không tìm thấy chi tiết sản phẩm cho productId: " + productId);
        }

        // Xóa các chi tiết sản phẩm
        repository.deleteAll(details);
    }


}
