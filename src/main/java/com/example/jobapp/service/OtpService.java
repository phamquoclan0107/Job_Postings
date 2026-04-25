package com.example.jobapp.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * OtpService — sinh OTP 6 số, gửi email, xác thực.
 * Lưu OTP in-memory (ConcurrentHashMap). Với production nên dùng Redis.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class OtpService {

    private final JavaMailSender mailSender;

    @Value("${otp.expiration-ms:300000}")
    private long expirationMs;   // mặc định 5 phút

    @Value("${spring.mail.username}")
    private String fromEmail;

    // key = email, value = OtpEntry
    private final Map<String, OtpEntry> store = new ConcurrentHashMap<>();

    private static final SecureRandom RANDOM = new SecureRandom();

    // ─── Public API ──────────────────────────────────────────────────────────

    /**
     * Sinh OTP, lưu vào store, gửi email.
     */
    public void sendOtp(String toEmail, String subject) {
        String otp = generateOtp();
        store.put(toEmail, new OtpEntry(otp, Instant.now().plusMillis(expirationMs)));
        sendEmail(toEmail, subject, buildBody(otp));
        log.info("OTP sent to {}", toEmail);
    }

    /**
     * Xác thực OTP.
     * @return true nếu đúng và chưa hết hạn
     */
    public boolean verify(String email, String otp) {
        OtpEntry entry = store.get(email);
        if (entry == null) return false;
        if (Instant.now().isAfter(entry.expiry())) {
            store.remove(email);
            return false;
        }
        return entry.otp().equals(otp);
    }

    /**
     * Xoá OTP sau khi dùng xong.
     */
    public void invalidate(String email) {
        store.remove(email);
    }

    // ─── Private ─────────────────────────────────────────────────────────────

    private String generateOtp() {
        return String.format("%06d", RANDOM.nextInt(1_000_000));
    }

    private String buildBody(String otp) {
        return "Mã OTP của bạn là: " + otp + "\n\n" +
               "Mã có hiệu lực trong 5 phút. Không chia sẻ mã này cho bất kỳ ai.";
    }

    private void sendEmail(String to, String subject, String body) {
        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setFrom(fromEmail);
        msg.setTo(to);
        msg.setSubject(subject);
        msg.setText(body);
        mailSender.send(msg);
    }

    private record OtpEntry(String otp, Instant expiry) {}
}
