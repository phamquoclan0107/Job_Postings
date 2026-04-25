package com.example.jobapp.repository;

import com.example.jobapp.Entity.Category;
import com.example.jobapp.Entity.Category.CategoryType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Integer> {
    List<Category> findByType(CategoryType type);
    boolean existsByNameAndType(String name, CategoryType type);
}