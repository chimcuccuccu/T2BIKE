package com.example.bikeshop.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BicycleDetailRequest {
    private Long productId;
    private List<DetailDTO> attributes;
}
