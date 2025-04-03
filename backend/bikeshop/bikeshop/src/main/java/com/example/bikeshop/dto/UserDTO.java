package com.example.bikeshop.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.time.LocalDate;

@Data
public class UserDTO {
    private String username;
    private String password;
    private String fullName;
    private String email;
    private String gender;
    private String phone;
    private String address;

    @JsonFormat(pattern = "dd-MM-yyyy")
    private LocalDate birthDate;
}
