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

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface JobPostingRepository extends JpaRepository<JobPosting, Integer> {

    @Query("SELECT j FROM JobPosting j " +
            "JOIN FETCH j.category c " +
            "JOIN FETCH j.admin a " +
            "WHERE j.deletedAt IS NULL " +
            "AND j.status = com.example.jobapp.Entity.JobPosting.JobStatus.ACTIVE " +
            "ORDER BY j.createdAt DESC")
    List<JobPosting> findAllActive();

    @Query(value = "SELECT j FROM JobPosting j " +
            "JOIN FETCH j.category c " +
            "JOIN FETCH j.admin a " +
            "WHERE j.deletedAt IS NULL " +
            "AND (:keyword IS NULL OR LOWER(j.title) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "     OR LOWER(j.description) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
            "AND (:location IS NULL OR LOWER(j.location) LIKE LOWER(CONCAT('%', :location, '%'))) " +
            "AND (:salaryMin IS NULL OR j.salaryMin >= :salaryMin) " +
            "AND (:salaryMax IS NULL OR j.salaryMax <= :salaryMax) " +
            "AND (:categoryId IS NULL OR c.id = :categoryId) " +
            "AND (:status IS NULL OR j.status = :status)",
            countQuery = "SELECT COUNT(j) FROM JobPosting j " +
                    "WHERE j.deletedAt IS NULL " +
                    "AND (:keyword IS NULL OR LOWER(j.title) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
                    "     OR LOWER(j.description) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
                    "AND (:location IS NULL OR LOWER(j.location) LIKE LOWER(CONCAT('%', :location, '%'))) " +
                    "AND (:salaryMin IS NULL OR j.salaryMin >= :salaryMin) " +
                    "AND (:salaryMax IS NULL OR j.salaryMax <= :salaryMax) " +
                    "AND (:categoryId IS NULL OR j.category.id = :categoryId) " +
                    "AND (:status IS NULL OR j.status = :status)")
    Page<JobPosting> search(
            @Param("keyword")    String keyword,
            @Param("location")   String location,
            @Param("salaryMin")  BigDecimal salaryMin,
            @Param("salaryMax")  BigDecimal salaryMax,
            @Param("categoryId") Integer categoryId,
            @Param("status")     JobStatus status,
            Pageable pageable
    );

    @Query("SELECT j FROM JobPosting j " +
            "JOIN FETCH j.category c " +
            "JOIN FETCH j.admin a " +
            "WHERE j.id = :id AND j.deletedAt IS NULL")
    Optional<JobPosting> findActiveById(@Param("id") Integer id);

    @Query("SELECT j FROM JobPosting j " +
            "JOIN FETCH j.category c " +
            "JOIN FETCH j.admin a " +
            "WHERE j.deletedAt IS NULL " +
            "AND j.status = com.example.jobapp.Entity.JobPosting.JobStatus.ACTIVE " +
            "AND j.category.id = :categoryId " +
            "AND j.id <> :excludeId " +
            "ORDER BY j.createdAt DESC")
    List<JobPosting> findSimilar(
            @Param("categoryId") Integer categoryId,
            @Param("excludeId")  Integer excludeId,
            Pageable pageable
    );

    @Query("SELECT j FROM JobPosting j " +
            "WHERE j.deletedAt IS NULL " +
            "AND j.status = com.example.jobapp.Entity.JobPosting.JobStatus.ACTIVE " +
            "AND j.expiresAt IS NOT NULL " +
            "AND j.expiresAt < :today")
    List<JobPosting> findExpiredActiveJobs(@Param("today") LocalDate today);

    @Modifying
    @Query("UPDATE JobPosting j SET j.deletedAt = :now WHERE j.id = :id")
    void softDelete(@Param("id") Integer id, @Param("now") LocalDateTime now);

    @Modifying
    @Query("UPDATE JobPosting j SET j.status = com.example.jobapp.Entity.JobPosting.JobStatus.CLOSED, j.updatedAt = :now " +
            "WHERE j.status = com.example.jobapp.Entity.JobPosting.JobStatus.ACTIVE " +
            "AND j.deletedAt IS NULL " +
            "AND j.expiresAt IS NOT NULL " +
            "AND j.expiresAt < :today")
    int closeExpiredJobs(@Param("today") LocalDate today, @Param("now") LocalDateTime now);
}