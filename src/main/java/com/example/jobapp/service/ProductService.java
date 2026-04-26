package com.example.jobapp.service;

import com.example.jobapp.DTOs.ProductDTO;
import com.example.jobapp.DTOs.ProductImageDTO;
import com.example.jobapp.Entity.*;
import com.example.jobapp.exception.AppException;
import com.example.jobapp.mapper.ProductMapper;
import com.example.jobapp.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class ProductService {

    private final ProductRepository      productRepo;
    private final ProductImageRepository imageRepo;
    private final CategoryRepository     categoryRepo;
    private final ProductMapper          mapper;
    private final FileStorageService     fileStorage;

    // ─── Read ──────────────────────────────────────────────────────────────────

    @Transactional(readOnly = true)
    public Page<ProductDTO.Response> search(Integer categoryId, Boolean isActive, Pageable pageable) {
        return productRepo.search(categoryId, isActive, pageable)
                .map(mapper::toResponse);
    }

    @Transactional(readOnly = true)
    public ProductDTO.Response getById(Integer id) {
        Product product = productRepo.findByIdWithDetails(id)
                .orElseThrow(() -> AppException.notFound("Sản phẩm không tồn tại: " + id));
        return mapper.toResponse(product);
    }

    // ─── Create ────────────────────────────────────────────────────────────────

    public ProductDTO.Response create(ProductDTO.CreateRequest req) {
        if (productRepo.existsByProductCode(req.getProductCode())) {
            throw AppException.conflict("Mã sản phẩm đã tồn tại: " + req.getProductCode());
        }

        Category category = categoryRepo.findById(req.getCategoryId())
                .orElseThrow(() -> AppException.notFound("Danh mục không tồn tại: " + req.getCategoryId()));

        Product product = Product.builder()
                .category(category)
                .productCode(req.getProductCode())
                .name(req.getName())
                .description(req.getDescription())
                .isActive(req.getIsActive() != null ? req.getIsActive() : true)
                .build();

        Product saved = productRepo.save(product);
        log.info("Product created: id={}, code={}", saved.getId(), saved.getProductCode());
        return mapper.toResponse(saved);
    }

    // ─── Update ────────────────────────────────────────────────────────────────

    public ProductDTO.Response update(Integer id, ProductDTO.UpdateRequest req) {
        Product product = productRepo.findByIdWithDetails(id)
                .orElseThrow(() -> AppException.notFound("Sản phẩm không tồn tại: " + id));

        if (req.getCategoryId() != null) {
            Category cat = categoryRepo.findById(req.getCategoryId())
                    .orElseThrow(() -> AppException.notFound("Danh mục không tồn tại: " + req.getCategoryId()));
            product.setCategory(cat);
        }
        if (req.getName()        != null) product.setName(req.getName());
        if (req.getDescription() != null) product.setDescription(req.getDescription());
        if (req.getIsActive()    != null) product.setIsActive(req.getIsActive());

        Product saved = productRepo.save(product);
        log.info("Product updated: id={}", saved.getId());
        return mapper.toResponse(saved);
    }

    // ─── Delete ────────────────────────────────────────────────────────────────

    public void delete(Integer id) {
        Product product = productRepo.findByIdWithDetails(id)
                .orElseThrow(() -> AppException.notFound("Sản phẩm không tồn tại: " + id));

        // Xóa file ảnh trên disk trước khi xóa DB
        for (ProductImage img : product.getImages()) {
            try {
                fileStorage.deleteProductImage(img.getUrl());
            } catch (Exception e) {
                log.warn("Could not delete image file: {}", img.getUrl());
            }
        }

        productRepo.deleteById(id);
        log.info("Product deleted: id={}", id);
    }

    // ─── Image management ──────────────────────────────────────────────────────

    /**
     * Upload nhiều ảnh cho product.
     * Tên file: productCode_originalName (sort_order theo thứ tự upload)
     */
    public List<ProductImageDTO.Response> addImages(Integer productId, List<MultipartFile> files) {
        Product product = productRepo.findByIdWithDetails(productId)
                .orElseThrow(() -> AppException.notFound("Sản phẩm không tồn tại: " + productId));

        long currentCount = imageRepo.countByProductId(productId);
        List<ProductImageDTO.Response> result = new ArrayList<>();

        for (int i = 0; i < files.size(); i++) {
            MultipartFile file = files.get(i);
            if (file.isEmpty()) continue;

            String url      = fileStorage.saveProductImage(file, product.getProductCode());
            String filename = fileStorage.extractPublicFilename(url);

            ProductImage image = ProductImage.builder()
                    .product(product)
                    .fileName(filename)
                    .url(url)
                    .sortOrder((int) (currentCount + i))
                    .build();

            ProductImage saved = imageRepo.save(image);
            result.add(mapper.toImageResponse(saved));
        }

        log.info("Added {} images to product: id={}", result.size(), productId);
        return result;
    }

    /**
     * Xóa 1 ảnh theo imageId.
     */
    public void deleteImage(Integer productId, Integer imageId) {
        ProductImage image = imageRepo.findById(imageId)
                .orElseThrow(() -> AppException.notFound("Ảnh không tồn tại: " + imageId));

        if (!image.getProduct().getId().equals(productId)) {
            throw AppException.badRequest("Ảnh không thuộc sản phẩm: " + productId);
        }

        try {
            fileStorage.deleteProductImage(image.getUrl());
        } catch (Exception e) {
            log.warn("Could not delete image file: {}", image.getUrl());
        }

        imageRepo.deleteById(imageId);
        log.info("Image deleted: id={}", imageId);
    }

    /**
     * Cập nhật sort_order của ảnh.
     */
    public ProductImageDTO.Response updateImageSortOrder(Integer productId,
                                                         Integer imageId,
                                                         Integer sortOrder) {
        ProductImage image = imageRepo.findById(imageId)
                .orElseThrow(() -> AppException.notFound("Ảnh không tồn tại: " + imageId));

        if (!image.getProduct().getId().equals(productId)) {
            throw AppException.badRequest("Ảnh không thuộc sản phẩm: " + productId);
        }

        image.setSortOrder(sortOrder);
        ProductImage saved = imageRepo.save(image);
        return mapper.toImageResponse(saved);
    }
}