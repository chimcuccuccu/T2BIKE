package com.example.bikeshop.dto;

import com.example.bikeshop.entity.Product;
import com.example.bikeshop.entity.ProductAttribute;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
public class ProductAttributeDTO {
    private Long productId;
    private String name;
    private String description;
    private double price;
    private String imageUrl;
    private String category;
    private String brand;
    private List<AttributeDTO> attributes;

    public ProductAttributeDTO (Product product, List<ProductAttribute> attributes) {
        this.productId = product.getId();
        this.name = product.getName();
        this.description = product.getDescription();
        this.price = product.getPrice();
        this.imageUrl = product.getImageUrl();
        this.category = product.getCategory();
        this.brand = product.getBrand();
        this.attributes = attributes.stream()
                .map(attr -> new AttributeDTO(attr.getAttributeName(), attr.getAttributeValue()))
                .collect(Collectors.toList());
    }
}
