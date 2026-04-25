package com.example.jobapp.Entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(
        name = "job_postings",
        indexes = {
                @Index(name = "idx_job_status",     columnList = "status"),
                @Index(name = "idx_job_category",   columnList = "category_id"),
                @Index(name = "idx_job_expires",    columnList = "expires_at"),
                @Index(name = "idx_job_deleted",    columnList = "deleted_at"),
                @Index(name = "idx_job_title",      columnList = "title")
        }
)
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class JobPosting {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "category_id", nullable = false,
            foreignKey = @ForeignKey(name = "fk_job_category"))
    private Category category;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "admin_id", nullable = false,
            foreignKey = @ForeignKey(name = "fk_job_admin"))
    private Admin admin;

    @Column(name = "title", nullable = false, length = 200)
    private String title;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "salary", precision = 18, scale = 2)
    private BigDecimal salary;

    @Column(name = "location", length = 200)
    private String location;

    @Column(name = "image_url", length = 500)
    private String imageUrl;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false,
            columnDefinition = "ENUM('ACTIVE','CLOSED') DEFAULT 'ACTIVE'")
    private JobStatus status;

    @Column(name = "expires_at")
    private LocalDate expiresAt;

    // ✅ Soft delete
    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    // ✅ FIX: Uppercase theo yêu cầu
    public enum JobStatus {
        ACTIVE, CLOSED
    }

    public boolean isDeleted() {
        return deletedAt != null;
    }
}