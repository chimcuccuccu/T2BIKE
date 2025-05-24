package com.example.bikeshop.repository;

import com.example.bikeshop.entity.ShopReview;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ShopReviewRepository extends JpaRepository<ShopReview, Long> {
    boolean existsByUserId(Long userId);

    List<ShopReview> findByUserId(Long userId);

    @Query("SELECT AVG(r.rating) FROM ShopReview r")
    Double findAverageRating();

    boolean existsByIdAndUserId(Long id, Long userId);

    @Query("SELECT r.rating AS rating, COUNT(r) AS count FROM ShopReview r GROUP BY r.rating")
    List<Object[]> findRatingCounts();

    Page<ShopReview> findAll(Specification<ShopReview> spec, Pageable pageable);
}
