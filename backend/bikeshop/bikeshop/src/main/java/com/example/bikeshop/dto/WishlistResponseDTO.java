package com.example.bikeshop.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class WishlistResponseDTO {
    private String userName;
    private List<WishlistItemViewDTO> items;

    public WishlistResponseDTO(String userName, List<WishlistItemViewDTO> items) {
        this.userName = userName;
        this.items = items;
    }
}
