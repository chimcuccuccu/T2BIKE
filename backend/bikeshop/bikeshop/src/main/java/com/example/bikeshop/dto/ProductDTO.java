package com.example.bikeshop.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
public class ProductDTO {
    private Long id;
    private String name;
    private String description;
    private Double price;
    private String category;
    private String brand;
    private Integer quantity;
    private List<String> imageUrls;
    private String color;

    public ProductDTO() {

    }
}
