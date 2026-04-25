package com.example.jobapp.Entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(
        name = "job_postings",
        indexes = {
                @Index(name = "idx_job_postings_status",     columnList = "status"),
                @Index(name = "idx_job_postings_category",   columnList = "category_id"),
                @Index(name = "idx_job_postings_expires_at", columnList = "expires_at")
        }
)
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class JobPosting {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    // FK -> categories
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "category_id",
            nullable = false,
            foreignKey = @ForeignKey(name = "fk_job_postings_category")
    )
    private Category category;

    // FK -> admins
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "admin_id",
            nullable = false,
            foreignKey = @ForeignKey(name = "fk_job_postings_admin")
    )
    private Admin admin;

    @Column(name = "title", nullable = false, length = 200)
    private String title;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "requirements", columnDefinition = "TEXT")
    private String requirements;

    @Column(name = "benefits", columnDefinition = "TEXT")
    private String benefits;

    // Cột riêng của bạn — quyền lợi / điểm hấp dẫn
    @Column(name = "interest", columnDefinition = "TEXT")
    private String interest;

    @Column(name = "location", length = 200)
    private String location;

    @Column(name = "contact_email", nullable = false, length = 100)
    private String contactEmail;

    @Column(name = "contact_phone", length = 20)
    private String contactPhone;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false,
            columnDefinition = "ENUM('draft','active','closed') DEFAULT 'draft'")
    private JobStatus status;

    @Column(name = "expires_at")
    private LocalDate expiresAt;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    public enum JobStatus {
        draft, active, closed
    }
}
