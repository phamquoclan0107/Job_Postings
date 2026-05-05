package com.example.jobapp.Controller;

import com.example.jobapp.common.ApiResponse;
import com.example.jobapp.DTOs.ProductDTO;
import com.example.jobapp.DTOs.ProductImageDTO;
import com.example.jobapp.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

/**
 * GET    /api/products              — phân trang + filter
 * GET    /api/products/{id}         — chi tiết (bao gồm ảnh)
 * POST   /api/products              — tạo mới (cần JWT)
 * PUT    /api/products/{id}         — cập nhật (cần JWT)
 * DELETE /api/products/{id}         — xóa (cần JWT)
 *
 * POST   /api/products/{id}/images          — upload nhiều ảnh (cần JWT)
 * DELETE /api/products/{id}/images/{imageId} — xóa 1 ảnh (cần JWT)
 * PUT    /api/products/{id}/images/{imageId}/sort — cập nhật sort_order (cần JWT)
 */
@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    // ─── CRUD ──────────────────────────────────────────────────────────────────

    @GetMapping
    public ResponseEntity<ApiResponse<Page<ProductDTO.Response>>> getAll(
            @RequestParam(required = false) Integer categoryId,
            @RequestParam(required = false) Boolean isActive,
            @RequestParam(required = false) String name,
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt,desc") String sort) {

        String[] parts   = sort.split(",");
        Sort.Direction dir = parts.length > 1 && parts[1].equalsIgnoreCase("asc")
                ? Sort.Direction.ASC : Sort.Direction.DESC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(dir, parts[0]));

        return ResponseEntity.ok(ApiResponse.ok(productService.search(categoryId, isActive, name, pageable)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductDTO.Response>> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(ApiResponse.ok(productService.getById(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ProductDTO.Response>> create(
            @Valid @RequestBody ProductDTO.CreateRequest req) {
        ProductDTO.Response resp = productService.create(req);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.created("Tạo sản phẩm thành công", resp));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductDTO.Response>> update(
            @PathVariable Integer id,
            @Valid @RequestBody ProductDTO.UpdateRequest req) {
        return ResponseEntity.ok(
                ApiResponse.ok("Cập nhật sản phẩm thành công", productService.update(id, req))
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Integer id) {
        productService.delete(id);
        return ResponseEntity.ok(ApiResponse.noContent("Xóa sản phẩm thành công"));
    }

    // ─── Image endpoints ───────────────────────────────────────────────────────

    /**
     * Upload nhiều ảnh cho product.
     * Request: multipart/form-data, key = "files"
     * Tên file lưu: productCode_originalName
     */
    @PostMapping("/{id}/images")
    public ResponseEntity<ApiResponse<List<ProductImageDTO.Response>>> addImages(
            @PathVariable Integer id,
            @RequestParam("files") List<MultipartFile> files) {

        List<ProductImageDTO.Response> images = productService.addImages(id, files);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.created("Upload ảnh thành công", images));
    }

    /**
     * Xóa 1 ảnh theo imageId.
     */
    @DeleteMapping("/{id}/images/{imageId}")
    public ResponseEntity<ApiResponse<Void>> deleteImage(
            @PathVariable Integer id,
            @PathVariable Integer imageId) {
        productService.deleteImage(id, imageId);
        return ResponseEntity.ok(ApiResponse.noContent("Xóa ảnh thành công"));
    }

    /**
     * Cập nhật sort_order của 1 ảnh.
     * Body: { "sortOrder": 2 }
     */
    @PutMapping("/{id}/images/{imageId}/sort")
    public ResponseEntity<ApiResponse<ProductImageDTO.Response>> updateSortOrder(
            @PathVariable Integer id,
            @PathVariable Integer imageId,
            @RequestParam Integer sortOrder) {
        return ResponseEntity.ok(
                ApiResponse.ok("Cập nhật thứ tự ảnh thành công",
                        productService.updateImageSortOrder(id, imageId, sortOrder))
        );
    }
}