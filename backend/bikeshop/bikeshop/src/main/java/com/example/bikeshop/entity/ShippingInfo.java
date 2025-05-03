package com.example.bikeshop.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "shipping_info")
@Getter
@Setter
public class ShippingInfo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "receiver_name", nullable = false, length = 255)
    private String receiverName;

    @Column(name = "phone", length = 20)
    private String phone;

    @Column(name = "province", length = 255)
    private String province;

    @Column(name = "district", nullable = false, length = 255)
    private String district;

    @Column(name = "address", nullable = false, length = 255)
    private String address;

    @Column(name = "note", columnDefinition = "TEXT")
    private String note;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false, unique = true)
    @JsonBackReference
    private Order order;
}
