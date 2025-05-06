package com.example.bikeshop.controller;

import com.example.bikeshop.entity.Image;
import com.example.bikeshop.entity.Product;
import com.example.bikeshop.service.CloudinaryService;
import com.example.bikeshop.service.ImageService;
import com.example.bikeshop.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/cloudinary")
public class ImageController {
    @Autowired
    CloudinaryService cloudinaryService;

    @Autowired
    ImageService imageService;

    @Autowired
    ProductService productService;  // Service để lấy thông tin sản phẩm

    // Danh sách ảnh
    @GetMapping("/list")
    public ResponseEntity<List<Image>> list() {
        List<Image> list = imageService.list();
        return new ResponseEntity<>(list, HttpStatus.OK);
    }

    // Upload ảnh cho sản phẩm
    @PostMapping("/upload/{productId}")
    @ResponseBody
    public ResponseEntity<String> upload(@RequestParam MultipartFile multipartFile, @PathVariable Long productId) throws IOException {
        // Kiểm tra xem sản phẩm có tồn tại không
        Product product = productService.getProductById(productId);
        if (product == null) {
            return new ResponseEntity<>("Product not found", HttpStatus.NOT_FOUND);
        }

        // Đọc ảnh từ MultipartFile
        BufferedImage bi = ImageIO.read(multipartFile.getInputStream());
        if (bi == null) {
            return new ResponseEntity<>("Invalid image", HttpStatus.BAD_REQUEST);
        }

        // Upload ảnh lên Cloudinary
        Map<String, Object> result = cloudinaryService.upload(multipartFile);

        // Tạo đối tượng Image và liên kết với sản phẩm
        Image image = new Image(
                (String) result.get("original_filename"),
                (String) result.get("url"),
                (String) result.get("public_id")
        );

        // Liên kết ảnh với sản phẩm
        image.setProduct(product);
        imageService.save(image);

        return new ResponseEntity<>("Image uploaded successfully", HttpStatus.OK);
    }

    // Xóa ảnh
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> delete(@PathVariable("id") int id) {
        Optional<Image> imageOptional = imageService.getOne(id);
        if (imageOptional.isEmpty()) {
            return new ResponseEntity<>("Image not found", HttpStatus.NOT_FOUND);
        }

        Image image = imageOptional.get();
        String cloudinaryImageId = image.getImageUrl(); // Dùng public_id của ảnh trên Cloudinary
        try {
            cloudinaryService.delete(cloudinaryImageId);
        } catch (IOException e) {
            return new ResponseEntity<>("Failed to delete image from Cloudinary", HttpStatus.INTERNAL_SERVER_ERROR);
        }

        imageService.delete(id);
        return new ResponseEntity<>("Image deleted successfully", HttpStatus.OK);
    }
}

