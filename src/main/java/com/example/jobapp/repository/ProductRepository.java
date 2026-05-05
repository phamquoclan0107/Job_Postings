package com.example.jobapp.repository;

import com.example.jobapp.Entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Integer> {

    // ✅ Fetch join images + category trong 1 query — chống N+1
    @Query("SELECT DISTINCT p FROM Product p " +
            "JOIN FETCH p.category c " +
            "LEFT JOIN FETCH p.images i " +
            "WHERE p.id = :id")
    Optional<Product> findByIdWithDetails(@Param("id") Integer id);

    // ✅ Pagination + filter (category, isActive, name)
    @Query("SELECT p FROM Product p " +
            "JOIN FETCH p.category c " +
            "WHERE (:categoryId IS NULL OR c.id = :categoryId) " +
            "AND (:isActive IS NULL OR p.isActive = :isActive) " +
            "AND (:name IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :name, '%')))")
    Page<Product> search(
            @Param("categoryId") Integer categoryId,
            @Param("isActive")   Boolean isActive,
            @Param("name")       String name,
            Pageable pageable
    );

    boolean existsByProductCode(String productCode);
}