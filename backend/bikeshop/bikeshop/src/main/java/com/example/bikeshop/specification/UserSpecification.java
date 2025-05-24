package com.example.bikeshop.specification;

import com.example.bikeshop.entity.User;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

public class UserSpecification {
    public static Specification<User> containsKeywordInMultipleFields(String keyword) {
        return (root, query, builder) -> {
            if (keyword == null || keyword.trim().isEmpty()) {
                return builder.conjunction(); // Không lọc gì, trả về tất cả
            }

            String likePattern = "%" + keyword.toLowerCase() + "%";

            Predicate usernamePredicate = builder.like(builder.lower(root.get("username")), likePattern);
            Predicate fullNamePredicate = builder.like(builder.lower(root.get("fullName")), likePattern);
            Predicate emailPredicate = builder.like(builder.lower(root.get("email")), likePattern);
            Predicate phonePredicate = builder.like(builder.lower(root.get("phone")), likePattern);
            Predicate addressPredicate = builder.like(builder.lower(root.get("address")), likePattern);

            return builder.or(usernamePredicate, fullNamePredicate, emailPredicate, phonePredicate, addressPredicate);
        };
    }
}
