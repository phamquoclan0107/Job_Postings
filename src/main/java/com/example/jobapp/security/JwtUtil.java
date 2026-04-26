package com.example.jobapp.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

/**
 * Utility xử lý JWT.
 * - Tạo access token (15 phút)
 * - Tạo refresh token (7 ngày)
 * - Parse + validate token
 * KHÔNG chứa logic business, chỉ xử lý JWT thuần.
 */
@Slf4j
@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.access-token-expiration}")
    private long accessTokenExpiration;   // ms — 900000 = 15 phút

    @Value("${jwt.refresh-token-expiration}")
    private long refreshTokenExpiration;  // ms — 604800000 = 7 ngày

    private static final String TOKEN_TYPE_CLAIM = "type";
    private static final String TYPE_ACCESS      = "access";
    private static final String TYPE_REFRESH     = "refresh";

    // ─── Generate ──────────────────────────────────────────────────────────────

    public String generateAccessToken(String username) {
        return buildToken(username, TYPE_ACCESS, accessTokenExpiration);
    }

    public String generateRefreshToken(String username) {
        return buildToken(username, TYPE_REFRESH, refreshTokenExpiration);
    }

    private String buildToken(String subject, String type, long expirationMs) {
        Date now = new Date();
        return Jwts.builder()
                .subject(subject)
                .claim(TOKEN_TYPE_CLAIM, type)
                .issuedAt(now)
                .expiration(new Date(now.getTime() + expirationMs))
                .signWith(getSigningKey())
                .compact();
    }

    // ─── Parse ─────────────────────────────────────────────────────────────────

    public String extractUsername(String token) {
        return parseClaims(token).getSubject();
    }

    public boolean isAccessToken(String token) {
        return TYPE_ACCESS.equals(parseClaims(token).get(TOKEN_TYPE_CLAIM, String.class));
    }

    public boolean isRefreshToken(String token) {
        return TYPE_REFRESH.equals(parseClaims(token).get(TOKEN_TYPE_CLAIM, String.class));
    }

    public boolean validateToken(String token) {
        try {
            parseClaims(token);
            return true;
        } catch (ExpiredJwtException e) {
            log.warn("JWT expired: {}", e.getMessage());
        } catch (JwtException e) {
            log.warn("JWT invalid: {}", e.getMessage());
        }
        return false;
    }

    // ─── Private ───────────────────────────────────────────────────────────────

    private Claims parseClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }
}