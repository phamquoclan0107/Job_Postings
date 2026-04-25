// ============================================================
// FILE: AdminRepository.java
// Package: com.example.jobapp.repository
// ============================================================
package com.example.jobapp.repository;

import com.example.jobapp.Entity.Admin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AdminRepository extends JpaRepository<Admin, Integer> {
    Optional<Admin> findByUsername(String username);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
}