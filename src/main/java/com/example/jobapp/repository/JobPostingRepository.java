package com.example.jobapp.repository;

import com.example.jobapp.Entity.JobPosting;
import com.example.jobapp.Entity.JobPosting.JobStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface JobPostingRepository extends JpaRepository<JobPosting, Integer> {

    // ✅ Chống N+1: fetch join category + admin trong 1 query
    @Query("SELECT j FROM JobPosting j " +
            "JOIN FETCH j.category c " +
            "JOIN FETCH j.admin a " +
            "WHERE j.deletedAt IS NULL")
    List<JobPosting> findAllActive();

    // ✅ Pagination + Search (title) + Filter (category, status)
    @Query("SELECT j FROM JobPosting j " +
            "JOIN FETCH j.category c " +
            "JOIN FETCH j.admin a " +
            "WHERE j.deletedAt IS NULL " +
            "AND (:title IS NULL OR LOWER(j.title) LIKE LOWER(CONCAT('%', :title, '%'))) " +
            "AND (:categoryId IS NULL OR c.id = :categoryId) " +
            "AND (:status IS NULL OR j.status = :status)")
    Page<JobPosting> search(
            @Param("title")      String title,
            @Param("categoryId") Integer categoryId,
            @Param("status")     JobStatus status,
            Pageable pageable
    );

    // Count query riêng cho pagination
    @Query("SELECT COUNT(j) FROM JobPosting j " +
            "WHERE j.deletedAt IS NULL " +
            "AND (:title IS NULL OR LOWER(j.title) LIKE LOWER(CONCAT('%', :title, '%'))) " +
            "AND (:categoryId IS NULL OR j.category.id = :categoryId) " +
            "AND (:status IS NULL OR j.status = :status)")
    long countSearch(
            @Param("title")      String title,
            @Param("categoryId") Integer categoryId,
            @Param("status")     JobStatus status
    );

    // Lấy theo id, chỉ bản chưa xóa
    @Query("SELECT j FROM JobPosting j " +
            "JOIN FETCH j.category c " +
            "JOIN FETCH j.admin a " +
            "WHERE j.id = :id AND j.deletedAt IS NULL")
    Optional<JobPosting> findActiveById(@Param("id") Integer id);

    // ✅ Cron job: tìm job đã hết hạn nhưng chưa CLOSED
    @Query("SELECT j FROM JobPosting j " +
            "WHERE j.deletedAt IS NULL " +
            "AND j.status = 'ACTIVE' " +
            "AND j.expiresAt IS NOT NULL " +
            "AND j.expiresAt < :today")
    List<JobPosting> findExpiredActiveJobs(@Param("today") LocalDate today);

    // ✅ Soft delete — chỉ set deletedAt
    @Modifying
    @Query("UPDATE JobPosting j SET j.deletedAt = :now WHERE j.id = :id")
    void softDelete(@Param("id") Integer id, @Param("now") LocalDateTime now);

    // ✅ Cron job: batch close expired jobs
    @Modifying
    @Query("UPDATE JobPosting j SET j.status = 'CLOSED', j.updatedAt = :now " +
            "WHERE j.status = 'ACTIVE' " +
            "AND j.deletedAt IS NULL " +
            "AND j.expiresAt IS NOT NULL " +
            "AND j.expiresAt < :today")
    int closeExpiredJobs(@Param("today") LocalDate today, @Param("now") LocalDateTime now);
}