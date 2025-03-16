package com.example.bikeshop.entity;

import com.example.bikeshop.service.StringListConverter;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Entity
@Table(name="products")
@Getter
@Setter
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name= "name")
    private String name;

    @Column(name = "description")
    private String description;

    @Column(name = "price")
    private Double price;

    @Convert(converter = StringListConverter.class)
    @Column(name = "image_urls", columnDefinition = "json")
    private List<String> imageUrls;

    @Column(name = "category")
    private String category;

    @Column(name = "brand")
    private String brand;

    @Convert(converter = StringListConverter.class)
    @Column(name = "color", columnDefinition = "json")
    private List<String> color;

    @Column(name = "quantity")
    private int quantity;
}
