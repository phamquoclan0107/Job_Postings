package com.example.jobapp.repository;

import com.example.jobapp.Entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Integer> {

    List<Category> findByTypeIgnoreCase(String type);

    boolean existsByNameAndTypeIgnoreCase(String name, String type);
}