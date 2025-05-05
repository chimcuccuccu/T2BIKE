package com.example.bikeshop.repository;

import com.example.bikeshop.dto.RevenueByTimeResponse;
import com.example.bikeshop.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    @Query("SELECT SUM(o.totalPrice) FROM Order o WHERE o.status = 'DELIVERED'")
    Double sumTotalRevenue();

    @Query("SELECT SUM(o.totalPrice) FROM Order o WHERE FUNCTION('WEEK', o.createdAt) = :week AND FUNCTION('YEAR', o.createdAt) = :year")
    Double getRevenueByWeek(@Param("week") int week, @Param("year") int year);

    @Query("SELECT SUM(o.totalPrice) FROM Order o WHERE FUNCTION('MONTH', o.createdAt) = :month AND FUNCTION('YEAR', o.createdAt) = :year")
    Double getRevenueByMonth(@Param("month") int month, @Param("year") int year);

    @Query("SELECT SUM(o.totalPrice) FROM Order o WHERE FUNCTION('YEAR', o.createdAt) = :year")
    Double getRevenueByYear(@Param("year") int year);


}
