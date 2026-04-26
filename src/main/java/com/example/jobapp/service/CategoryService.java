package com.example.jobapp.service;

import com.example.jobapp.DTOs.CategoryDTO;
import com.example.jobapp.Entity.Category;
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
    private final CategoryMapper     mapper;

    @Transactional(readOnly = true)
    public List<CategoryDTO.Response> getAll() {
        return categoryRepo.findAll()
                .stream()
                .map(mapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<CategoryDTO.Response> getByType(String type) {
        return categoryRepo.findByTypeIgnoreCase(type)
                .stream()
                .map(mapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public CategoryDTO.Response getById(Integer id) {
        Category category = categoryRepo.findById(id)
                .orElseThrow(() -> AppException.notFound("Danh mục không tồn tại: " + id));
        return mapper.toResponse(category);
    }

    public CategoryDTO.Response create(CategoryDTO.Request req) {
        String type = req.getType() != null ? req.getType().toUpperCase() : null;
        if (type == null || (!type.equals(Category.TYPE_JOB) && !type.equals(Category.TYPE_PRODUCT))) {
            throw AppException.badRequest("Type phải là JOB hoặc PRODUCT");
        }

        if (categoryRepo.existsByNameAndTypeIgnoreCase(req.getName(), type)) {
            throw AppException.badRequest("Danh mục '" + req.getName() + "' loại " + type + " đã tồn tại");
        }

        Category category = Category.builder()
                .name(req.getName())
                .type(type)
                .build();

        Category saved = categoryRepo.save(category);
        log.info("Category created: id={}, name={}, type={}", saved.getId(), saved.getName(), saved.getType());
        return mapper.toResponse(saved);
    }

    public CategoryDTO.Response update(Integer id, CategoryDTO.Request req) {
        Category category = categoryRepo.findById(id)
                .orElseThrow(() -> AppException.notFound("Danh mục không tồn tại: " + id));

        if (req.getName() != null) {
            category.setName(req.getName());
        }
        if (req.getType() != null) {
            String type = req.getType().toUpperCase();
            if (!type.equals(Category.TYPE_JOB) && !type.equals(Category.TYPE_PRODUCT)) {
                throw AppException.badRequest("Type phải là JOB hoặc PRODUCT");
            }
            category.setType(type);
        }

        Category saved = categoryRepo.save(category);
        log.info("Category updated: id={}", saved.getId());
        return mapper.toResponse(saved);
    }

    public void delete(Integer id) {
        if (!categoryRepo.existsById(id)) {
            throw AppException.notFound("Danh mục không tồn tại: " + id);
        }
        categoryRepo.deleteById(id);
        log.info("Category deleted: id={}", id);
    }
}