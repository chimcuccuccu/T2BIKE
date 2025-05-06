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
import java.util.ArrayList;
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
    ProductService productService;

    @GetMapping("/list")
    public ResponseEntity<List<Image>> list() {
        List<Image> list = imageService.list();
        return new ResponseEntity<>(list, HttpStatus.OK);
    }

    @PostMapping("/upload/{productId}")
    @ResponseBody
    public ResponseEntity<String> upload(@RequestParam MultipartFile multipartFile, @PathVariable Long productId) throws IOException {
        Product product = productService.getProductById(productId);
        if (product == null) {
            return new ResponseEntity<>("Product not found", HttpStatus.NOT_FOUND);
        }

        BufferedImage bi = ImageIO.read(multipartFile.getInputStream());
        if (bi == null) {
            return new ResponseEntity<>("Invalid image", HttpStatus.BAD_REQUEST);
        }

        Map<String, Object> result = cloudinaryService.upload(multipartFile);

        Image image = new Image(
                (String) result.get("original_filename"),
                (String) result.get("url"),
                (String) result.get("public_id")
        );

        System.out.println("Anh: " + result);

        image.setProduct(product);
        imageService.save(image);

        List<String> imageUrls = product.getImageUrls();
        if (imageUrls == null) {
            imageUrls = new ArrayList<>();
        }
        imageUrls.add((String) result.get("url"));
        product.setImageUrls(imageUrls);
        productService.save(product);

        return new ResponseEntity<>("Image uploaded successfully", HttpStatus.OK);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> delete(@PathVariable("id") int id) {
        Optional<Image> imageOptional = imageService.getOne(id);
        if (imageOptional.isEmpty()) {
            return new ResponseEntity<>("Image not found", HttpStatus.NOT_FOUND);
        }

        Image image = imageOptional.get();
        String cloudinaryImageId = image.getImageUrl();
        try {
            cloudinaryService.delete(cloudinaryImageId);
        } catch (IOException e) {
            return new ResponseEntity<>("Failed to delete image from Cloudinary", HttpStatus.INTERNAL_SERVER_ERROR);
        }

        imageService.delete(id);
        return new ResponseEntity<>("Image deleted successfully", HttpStatus.OK);
    }
}

