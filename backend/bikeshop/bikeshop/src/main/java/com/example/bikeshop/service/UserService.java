package com.example.bikeshop.service;

import com.example.bikeshop.dto.UserDTO;
import com.example.bikeshop.entity.User;
import com.example.bikeshop.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.regex.Pattern;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    public User registerUser(UserDTO userDTO) {
        User user = new User();
        user.setUsername(userDTO.getUsername());
        user.setPassword(userDTO.getPassword()); // Chưa mã hóa mật khẩu
        user.setFullName(userDTO.getFullName());
        user.setEmail(userDTO.getEmail());
        user.setGender(userDTO.getGender());
        user.setPhone(userDTO.getPhone());
        user.setAddress(userDTO.getAddress());
        return userRepository.save(user);
    }

    public Optional<User> getUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
}
