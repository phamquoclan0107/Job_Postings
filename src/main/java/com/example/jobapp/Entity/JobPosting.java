package com.example.jobapp.Entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.type.SqlTypes;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(
        name = "job_postings",
        indexes = {
                @Index(name = "idx_job_status",   columnList = "status"),
                @Index(name = "idx_job_category", columnList = "category_id"),
                @Index(name = "idx_job_expires",  columnList = "expires_at"),
                @Index(name = "idx_job_deleted",  columnList = "deleted_at"),
                @Index(name = "idx_job_title",    columnList = "title")
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

    @Column(name = "benefits", columnDefinition = "TEXT")
    private String benefits;

    @Column(name = "requirements", columnDefinition = "TEXT")
    private String requirements;

    @Column(name = "location", length = 200)
    private String location;

    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.VARCHAR)
    @Column(name = "job_type", length = 50)
    private JobType jobType;

    @Column(name = "experience_level", length = 100)
    private String experienceLevel;

    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.VARCHAR)
    @Column(name = "income_level", length = 20)
    private IncomeLevel incomeLevel;

    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.VARCHAR)
    @Column(name = "status", nullable = false, length = 10, columnDefinition = "VARCHAR(10) DEFAULT 'ACTIVE'")
    private JobStatus status;

    @Column(name = "contact_email", nullable = false, length = 255)
    private String contactEmail;

    @Column(name = "expires_at")
    private LocalDate expiresAt;

    @Column(name = "posted_at")
    private LocalDateTime postedAt;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    public enum JobStatus {
        ACTIVE, CLOSED
    }

    public enum JobType {
        FULL_TIME, PART_TIME, CONTRACT, REMOTE, INTERNSHIP
    }

    public enum IncomeLevel {
        THOA_THUAN,
        DUOI_10TR,
        TU_10_15TR,
        TU_15_20TR,
        TU_20_30TR,
        TREN_30TR
    }

    public boolean isDeleted() {
        return deletedAt != null;
    }

    @PrePersist
    protected void onPrePersist() {
        if (status == null) {
            status = JobStatus.ACTIVE;
        }
        if (postedAt == null) {
            postedAt = LocalDateTime.now();
        }
    }
}