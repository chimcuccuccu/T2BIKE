package com.example.bikeshop.repository;

import com.example.bikeshop.entity.ShopReview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ShopReviewRepository extends JpaRepository<ShopReview, Long> {
}
