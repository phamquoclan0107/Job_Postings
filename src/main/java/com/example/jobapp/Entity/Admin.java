package com.example.jobapp.Entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(
        name = "admins",
        uniqueConstraints = {
                @UniqueConstraint(name = "uq_admins_username", columnNames = "username"),
                @UniqueConstraint(name = "uq_admins_email",    columnNames = "email")
        }
)
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Admin {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "username", nullable = false, length = 50)
    private String username;

    @Column(name = "password_hash", nullable = false, length = 255)
    private String passwordHash;

    @Column(name = "email", nullable = false, length = 100)
    private String email;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    // Một admin có thể tạo nhiều tin tuyển dụng
    @OneToMany(mappedBy = "admin", fetch = FetchType.LAZY)
    private List<JobPosting> jobPostings;
}
