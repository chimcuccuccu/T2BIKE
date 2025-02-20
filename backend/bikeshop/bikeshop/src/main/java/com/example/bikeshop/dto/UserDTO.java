package com.example.bikeshop.dto;

import com.example.bikeshop.entity.User;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class UserDTO {
    private Long id;
    private String firstName;
    private String lastName;
    private String userName;
    private String email;
    private String dob;
    private String password;
    private String phoneNumber;
    private String gender;
    private String address;
    private String role;

    public UserDTO(User user) {
        this.id = user.getId();
        this.firstName = user.getFirstName();
        this.lastName = user.getLastName();
        this.userName = user.getUsername();
        this.email = user.getEmail();
        this.dob = user.getDob();
        this.password = user.getPassword();
        this.phoneNumber = user.getPhoneNumber();
        this.gender = user.getGender();
        this.address = user.getAddress();
        this.role = user.getRole();
    }
}
