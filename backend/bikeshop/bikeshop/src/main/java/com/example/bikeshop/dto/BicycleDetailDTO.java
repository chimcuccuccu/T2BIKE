package com.example.bikeshop.dto;

import com.example.bikeshop.entity.BicycleDetail;
import com.example.bikeshop.entity.Product;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
public class BicycleDetailDTO {
    private Long productId;
    private String name;
    private String description;
    private double price;
    private String category;
    private String brand;
    private int quantity;
    private List<String> color;
    private List<String> imageUrls;
    private List<DetailDTO> attributes;

    public BicycleDetailDTO (Product product, List<BicycleDetail> attributes) {
        this.productId = product.getId();
        this.name = product.getName();
        this.description = product.getDescription();
        this.price = product.getPrice();
        this.imageUrls = product.getImageUrls();
        this.category = product.getCategory();
        this.quantity = product.getQuantity();
        this.color = product.getColor();
        this.brand = product.getBrand();
        this.attributes = attributes.stream()
                .map(attr -> new DetailDTO(attr.getAttributeName(), attr.getAttributeValue()))
                .collect(Collectors.toList());
    }
}