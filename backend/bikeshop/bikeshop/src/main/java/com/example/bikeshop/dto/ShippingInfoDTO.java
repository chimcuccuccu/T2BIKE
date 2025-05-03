package com.example.bikeshop.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ShippingInfoDTO {
    private Long id;
    private String receiverName;
    private String phone;
    private String province;
    private String district;
    private String address;
    private String note;
}
