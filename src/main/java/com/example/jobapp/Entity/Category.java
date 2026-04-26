package com.example.jobapp.Entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(
        name = "categories",
        uniqueConstraints = {
                @UniqueConstraint(name = "uq_category_name_type", columnNames = {"name", "type"})
        }
)
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @Column(name = "type", nullable = false, length = 20)
    private String type;  // "JOB" hoặc "PRODUCT" — lưu dạng VARCHAR để tránh case-sensitive MySQL ENUM

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "category", fetch = FetchType.LAZY)
    private List<JobPosting> jobPostings;

    @OneToMany(mappedBy = "category", fetch = FetchType.LAZY)
    private List<Product> products;

    // Constants thay cho enum — để dùng như Category.TYPE_JOB
    public static final String TYPE_JOB     = "JOB";
    public static final String TYPE_PRODUCT = "PRODUCT";

    public boolean isJobCategory()     { return TYPE_JOB.equalsIgnoreCase(type); }
    public boolean isProductCategory() { return TYPE_PRODUCT.equalsIgnoreCase(type); }
}