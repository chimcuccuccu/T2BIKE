package com.example.bikeshop.service;

import com.example.bikeshop.dto.UserDTO;
import com.example.bikeshop.entity.Product;
import com.example.bikeshop.entity.User;
import com.example.bikeshop.repository.ProductRepository;
import com.example.bikeshop.repository.UserRepository;
import com.example.bikeshop.specification.UserSpecification;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.regex.Pattern;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ProductRepository productRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User registerUser(UserDTO userDTO) {
        if (userRepository.existsByUsername(userDTO.getUsername())) {
            throw new IllegalArgumentException("Username đã tồn tại!");
        }

        User user = new User();
        user.setUsername(userDTO.getUsername());
        user.setPassword(userDTO.getPassword());
        user.setFullName(userDTO.getFullName());
        user.setGender(userDTO.getGender());
        user.setBirthDate(userDTO.getBirthDate());

        return userRepository.save(user);
    }

    public User login(String username, String password) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Sai tên đăng nhập hoặc mật khẩu"));

        if (!user.getPassword().equals(password)) {
            throw new RuntimeException("Sai mật khẩu");
        }
        return user;
    }

    public Optional<User> getUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public Page<User> getAllUsers(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").ascending());
        return userRepository.findAll(pageable);
    }

    public void updateUserInfo(Long currentUserId, Long targetUserId, UserDTO updatedUserDTO) {
        User currentUser = userRepository.findById(currentUserId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy current user"));

        // Nếu không phải admin và không phải tự cập nhật chính mình → chặn
        if (!currentUser.getId().equals(targetUserId) && !"admin".equalsIgnoreCase(currentUser.getRole())) {
            throw new RuntimeException("Bạn không có quyền thực hiện thao tác này");
        }

        User user = userRepository.findById(targetUserId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy user cần cập nhật"));

        if (updatedUserDTO.getFullName() != null)
            user.setFullName(updatedUserDTO.getFullName());
        if (updatedUserDTO.getGender() != null)
            user.setGender(updatedUserDTO.getGender());
        if (updatedUserDTO.getBirthDate() != null)
            user.setBirthDate(updatedUserDTO.getBirthDate());
        if (updatedUserDTO.getEmail() != null)
            user.setEmail(updatedUserDTO.getEmail());
        if (updatedUserDTO.getPhone() != null)
            user.setPhone(updatedUserDTO.getPhone());
        if (updatedUserDTO.getAddress() != null)
            user.setAddress(updatedUserDTO.getAddress());

        userRepository.save(user);
    }

    public void deleteUser(Long id) {
        Optional<User> user = userRepository.findById(id);
        if (user.isEmpty()) {
            throw new RuntimeException("User không tồn tại");
        }
        userRepository.deleteById(id);
    }

    public Page<User> searchUsers(String keyword, int page, int size) {
        Specification<User> spec = UserSpecification.containsKeywordInMultipleFields(keyword);
        return userRepository.findAll(spec, PageRequest.of(page, size));
    }

}
