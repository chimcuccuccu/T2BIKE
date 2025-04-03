package com.example.bikeshop.exception;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<Map<String, String>> handleDatabaseExceptions(DataIntegrityViolationException ex) {
        Map<String, String> response = new HashMap<>();

        // Kiểm tra lỗi có liên quan đến mật khẩu không thỏa mãn điều kiện
        if (ex.getMessage().contains("chk_password")) {
            response.put("message", "Mật khẩu phải có ít nhất 1 chữ cái viết hoa, 1 chữ cái viết thường, 1 chữ số và dài tối thiểu 8 ký tự.");
        } else {
            response.put("message", "Có lỗi xảy ra, vui lòng thử lại.");
        }

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }
}
