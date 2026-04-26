package com.example.jobapp.service;

import com.example.jobapp.DTOs.CategoryDTO;
import com.example.jobapp.Entity.Category;
import com.example.jobapp.Entity.Category.CategoryType;
import com.example.jobapp.exception.AppException;
import com.example.jobapp.mapper.CategoryMapper;
import com.example.jobapp.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class CategoryService {

    private final CategoryRepository categoryRepo;
    private final CategoryMapper     categoryMapper;

    @Transactional(readOnly = true)
    public List<CategoryDTO.Response> getAll() {
        return categoryRepo.findAll()
                .stream()
                .map(categoryMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<CategoryDTO.Response> getByType(CategoryType type) {
        return categoryRepo.findByType(type)
                .stream()
                .map(categoryMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public CategoryDTO.Response getById(Integer id) {
        return categoryMapper.toResponse(findOrThrow(id));
    }

    public CategoryDTO.Response create(CategoryDTO.Request req) {
        if (categoryRepo.existsByNameAndType(req.getName(), req.getType())) {
            throw AppException.conflict(
                    "Danh mục '" + req.getName() + "' với loại " + req.getType() + " đã tồn tại"
            );
        }

        Category category = Category.builder()
                .name(req.getName())
                .type(req.getType())
                .build();

        Category saved = categoryRepo.save(category);
        log.info("Category created: id={}, name={}, type={}", saved.getId(), saved.getName(), saved.getType());
        return categoryMapper.toResponse(saved);
    }

    public CategoryDTO.Response update(Integer id, CategoryDTO.Request req) {
        Category category = findOrThrow(id);

        if (!category.getName().equals(req.getName()) || !category.getType().equals(req.getType())) {
            if (categoryRepo.existsByNameAndType(req.getName(), req.getType())) {
                throw AppException.conflict(
                        "Danh mục '" + req.getName() + "' với loại " + req.getType() + " đã tồn tại"
                );
            }
        }

        category.setName(req.getName());
        category.setType(req.getType());

        Category saved = categoryRepo.save(category);
        log.info("Category updated: id={}", saved.getId());
        return categoryMapper.toResponse(saved);
    }

    public void delete(Integer id) {
        if (!categoryRepo.existsById(id)) {
            throw AppException.notFound("Danh mục không tồn tại: " + id);
        }
        categoryRepo.deleteById(id);
        log.info("Category deleted: id={}", id);
    }

    private Category findOrThrow(Integer id) {
        return categoryRepo.findById(id)
                .orElseThrow(() -> AppException.notFound("Danh mục không tồn tại: " + id));
    }
}