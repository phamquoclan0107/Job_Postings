package com.example.jobapp.scheduler;

import com.example.jobapp.repository.JobPostingRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Cron job tự động đóng job posting đã hết hạn.
 * Chạy mỗi ngày lúc 00:05 AM.
 *
 * Cách hoạt động:
 *   1. Tìm tất cả job ACTIVE có expiresAt < hôm nay
 *   2. Batch UPDATE status = CLOSED
 *   3. Log số lượng job đã đóng
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class JobScheduler {

    private final JobPostingRepository jobPostingRepo;

    /**
     * Cron expression: "0 5 0 * * *"
     * = Giây 0, Phút 5, Giờ 0, mọi ngày trong tháng, mọi tháng, mọi ngày trong tuần
     * → Chạy lúc 00:05:00 mỗi ngày
     */
    @Scheduled(cron = "0 5 0 * * *")
    @Transactional
    public void closeExpiredJobs() {
        LocalDate today = LocalDate.now();
        LocalDateTime now = LocalDateTime.now();

        log.info("[JobScheduler] Running closeExpiredJobs at {}", now);

        try {
            int count = jobPostingRepo.closeExpiredJobs(today, now);
            log.info("[JobScheduler] Auto-closed {} expired job postings", count);
        } catch (Exception e) {
            log.error("[JobScheduler] Error closing expired jobs", e);
        }
    }
}