package com.example.bikeshop.repository;

import com.example.bikeshop.entity.ShopReview;
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


}
