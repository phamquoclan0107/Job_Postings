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

    @Query("SELECT j FROM JobPosting j " +
            "JOIN FETCH j.category c " +
            "JOIN FETCH j.admin a " +
            "WHERE j.deletedAt IS NULL " +
            "AND j.status = :status " +
            "ORDER BY j.createdAt DESC")
    List<JobPosting> findAllActive(@Param("status") JobStatus status);

    default List<JobPosting> findAllActive() {
        return findAllActive(JobStatus.ACTIVE);
    }

    @Query(value = "SELECT j FROM JobPosting j " +
            "JOIN FETCH j.category c " +
            "JOIN FETCH j.admin a " +
            "WHERE j.deletedAt IS NULL " +
            "AND (:keyword IS NULL OR LOWER(j.title) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "     OR LOWER(j.description) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
            "AND (:location IS NULL OR LOWER(j.location) LIKE LOWER(CONCAT('%', :location, '%'))) " +
            "AND (:categoryId IS NULL OR c.id = :categoryId) " +
            "AND (:status IS NULL OR j.status = :status)",
            countQuery = "SELECT COUNT(j) FROM JobPosting j " +
                    "WHERE j.deletedAt IS NULL " +
                    "AND (:keyword IS NULL OR LOWER(j.title) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
                    "     OR LOWER(j.description) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
                    "AND (:location IS NULL OR LOWER(j.location) LIKE LOWER(CONCAT('%', :location, '%'))) " +
                    "AND (:categoryId IS NULL OR j.category.id = :categoryId) " +
                    "AND (:status IS NULL OR j.status = :status)")
    Page<JobPosting> searchPage(
            @Param("keyword")    String keyword,
            @Param("location")   String location,
            @Param("categoryId") Integer categoryId,
            @Param("status")     JobStatus status,
            Pageable pageable
    );

    @Query("SELECT j FROM JobPosting j " +
            "JOIN FETCH j.category c " +
            "JOIN FETCH j.admin a " +
            "WHERE j.id IN :ids")
    List<JobPosting> findByIds(@Param("ids") List<Integer> ids);

    @Query("SELECT j FROM JobPosting j " +
            "JOIN FETCH j.category c " +
            "JOIN FETCH j.admin a " +
            "WHERE j.id = :id AND j.deletedAt IS NULL")
    Optional<JobPosting> findActiveById(@Param("id") Integer id);

    @Query("SELECT j FROM JobPosting j " +
            "JOIN FETCH j.category c " +
            "JOIN FETCH j.admin a " +
            "WHERE j.deletedAt IS NULL " +
            "AND j.status = :status " +
            "AND j.category.id = :categoryId " +
            "AND j.id <> :excludeId " +
            "ORDER BY j.createdAt DESC")
    List<JobPosting> findSimilar(
            @Param("categoryId") Integer categoryId,
            @Param("excludeId")  Integer excludeId,
            @Param("status")     JobStatus status,
            Pageable pageable
    );

    default List<JobPosting> findSimilar(Integer categoryId, Integer excludeId, Pageable pageable) {
        return findSimilar(categoryId, excludeId, JobStatus.ACTIVE, pageable);
    }

    @Query("SELECT j FROM JobPosting j " +
            "WHERE j.deletedAt IS NULL " +
            "AND j.status = :status " +
            "AND j.expiresAt IS NOT NULL " +
            "AND j.expiresAt < :today")
    List<JobPosting> findExpiredActiveJobs(
            @Param("today")  LocalDate today,
            @Param("status") JobStatus status
    );

    default List<JobPosting> findExpiredActiveJobs(LocalDate today) {
        return findExpiredActiveJobs(today, JobStatus.ACTIVE);
    }

    @Modifying
    @Query("UPDATE JobPosting j SET j.deletedAt = :now WHERE j.id = :id")
    void softDelete(@Param("id") Integer id, @Param("now") LocalDateTime now);

    @Modifying
    @Query("UPDATE JobPosting j SET j.status = :closed, j.updatedAt = :now " +
            "WHERE j.status = :active " +
            "AND j.deletedAt IS NULL " +
            "AND j.expiresAt IS NOT NULL " +
            "AND j.expiresAt < :today")
    int closeExpiredJobs(
            @Param("today")  LocalDate today,
            @Param("now")    LocalDateTime now,
            @Param("active") JobStatus active,
            @Param("closed") JobStatus closed
    );

    default int closeExpiredJobs(LocalDate today, LocalDateTime now) {
        return closeExpiredJobs(today, now, JobStatus.ACTIVE, JobStatus.CLOSED);
    }
}