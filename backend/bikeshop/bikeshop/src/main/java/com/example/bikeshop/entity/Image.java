package com.example.bikeshop.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "image")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Image {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(name = "image_url")
    private String imageUrl;

    private String publicId;

    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;

    public Image(String name, String imageUrl, String publicId) {
        this.name = name;
        this.imageUrl = imageUrl;
        this.publicId = publicId;
    }
}
