package com.example.jobapp.Controller;

import com.example.jobapp.common.ApiResponse;
import com.example.jobapp.DTOs.CategoryDTO;
import com.example.jobapp.service.CategoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<CategoryDTO.Response>>> getAll(
            @RequestParam(required = false) String type) {
        List<CategoryDTO.Response> result = (type != null && !type.isBlank())
                ? categoryService.getByType(type)
                : categoryService.getAll();
        return ResponseEntity.ok(ApiResponse.ok(result));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CategoryDTO.Response>> getById(
            @PathVariable Integer id) {
        return ResponseEntity.ok(ApiResponse.ok(categoryService.getById(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<CategoryDTO.Response>> create(
            @Valid @RequestBody CategoryDTO.Request req) {
        CategoryDTO.Response resp = categoryService.create(req);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.created("Tạo danh mục thành công", resp));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<CategoryDTO.Response>> update(
            @PathVariable Integer id,
            @Valid @RequestBody CategoryDTO.Request req) {
        return ResponseEntity.ok(
                ApiResponse.ok("Cập nhật danh mục thành công", categoryService.update(id, req))
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Integer id) {
        categoryService.delete(id);
        return ResponseEntity.ok(ApiResponse.noContent("Xóa danh mục thành công"));
    }
}