package com.example.bikeshop.repository;

import com.example.bikeshop.entity.BicycleDetail;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BicycleDetailRepository extends JpaRepository<BicycleDetail, Long> {
    List<BicycleDetail> findByProductId (Long productId);
}
