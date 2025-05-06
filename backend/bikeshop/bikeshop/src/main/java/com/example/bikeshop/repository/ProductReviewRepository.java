package com.example.bikeshop.repository;

import com.example.bikeshop.entity.ProductReview;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductReviewRepository extends JpaRepository<ProductReview, Long> {
    List<ProductReview> findByProductId(Long productId);

    Page<ProductReview> findAll(Pageable pageable);

    Page<ProductReview> findByAnswerIsNotNull(Pageable pageable);
}
