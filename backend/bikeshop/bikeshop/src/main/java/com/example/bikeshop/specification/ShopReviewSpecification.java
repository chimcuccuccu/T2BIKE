package com.example.bikeshop.specification;

import com.example.bikeshop.entity.ShopReview;
import org.springframework.data.jpa.domain.Specification;

public class ShopReviewSpecification {
    public static Specification<ShopReview> hasRating(Integer rating) {
        return (root, query, cb) -> rating == null ? null : cb.equal(root.get("rating"), rating);
    }

    public static Specification<ShopReview> containsKeyword(String keyword) {
        return (root, query, cb) -> {
            if (keyword == null || keyword.isEmpty()) return null;
            String likePattern = "%" + keyword.toLowerCase() + "%";
            return cb.or(
                    cb.like(cb.lower(root.get("comment")), likePattern),
                    cb.like(cb.lower(root.join("user").get("username")), likePattern)
            );
        };
    }
}
