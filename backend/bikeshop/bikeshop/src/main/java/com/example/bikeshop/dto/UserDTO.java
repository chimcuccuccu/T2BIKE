package com.example.bikeshop.dto;

import lombok.Data;

@Data
public class UserDTO {
    private String username;
    private String password;
    private String fullName;
    private String email;
    private String gender;
    private String phone;
    private String address;
}
