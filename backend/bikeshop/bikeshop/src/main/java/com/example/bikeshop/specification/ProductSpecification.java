package com.example.bikeshop.specification;

import com.example.bikeshop.entity.Product;
import org.springframework.data.jpa.domain.Specification;

public class ProductSpecification {

    public static Specification<Product> hasCategory (String category) {
        return (root, query, criteriaBuilder) ->
                category == null ? null : criteriaBuilder.equal(root.get("category"), category);
    }

    public static Specification<Product> hasBrand (String brand) {
        return (root, query, criteriaBuilder) ->
                brand == null ? null : criteriaBuilder.equal(root.get("brand"), brand);
    }

    public static Specification<Product> hasPriceBetween (Double minprice, Double maxPrice) {
        return (root, query, criteriaBuilder) -> {
            if (minprice == null && maxPrice == null) {
                return null;
            } else if (minprice == null) {
                return criteriaBuilder.lessThanOrEqualTo(root.get("price"), maxPrice);
            } else if (maxPrice == null) {
                return criteriaBuilder.greaterThanOrEqualTo(root.get("price"), minprice);
            } else {
                return criteriaBuilder.between(root.get("price"), minprice, maxPrice);
            }
        };
    }
}
