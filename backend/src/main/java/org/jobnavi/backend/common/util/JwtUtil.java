package org.jobnavi.backend.common.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.security.MessageDigest;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
public class JwtUtil {

    /**
     * IMPORTANT:
     * - Must be stable across restarts, otherwise tokens become invalid after reboot.
     * - Use a Base64-encoded 32+ bytes secret for HS256.
     */
    private final Key secretKey;

    private final long expirationMs;

    public JwtUtil(
            @Value("${jobnavi.jwt.secret}") String base64Secret,
            @Value("${jobnavi.jwt.expiration-ms:86400000}") long expirationMs
    ) {
        if (base64Secret == null || base64Secret.isBlank()) {
            throw new IllegalStateException("Missing config: jobnavi.jwt.secret");
        }

        // Accept either:
        // 1) Base64 secret (recommended), OR
        // 2) a plain string secret (dev-friendly). If not valid Base64, we derive 32 bytes via SHA-256.
        byte[] keyBytes = decodeSecretToKeyBytes(base64Secret.trim());
        this.secretKey = Keys.hmacShaKeyFor(keyBytes);
        this.expirationMs = expirationMs;
    }

    public String generateToken(Long userId, String username) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", userId);

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(username)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + expirationMs))
                .signWith(secretKey, SignatureAlgorithm.HS256)
                .compact();
    }

    public String extractUsername(String token) {
        return extractAllClaims(token).getSubject();
    }

    public Long extractUserId(String token) {
        return extractAllClaims(token).get("userId", Long.class);
    }

    public Date extractExpiration(String token) {
        return extractAllClaims(token).getExpiration();
    }

    public long getExpirationMs() {
        return expirationMs;
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(secretKey)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    private byte[] decodeSecretToKeyBytes(String secret) {
        // Allow explicit prefix to force base64 parsing.
        String s = secret;
        boolean forceBase64 = false;
        if (s.startsWith("base64:")) {
            forceBase64 = true;
            s = s.substring("base64:".length());
        }

        // Try Base64 first (unless it's clearly not).
        if (forceBase64 || looksLikeBase64(s)) {
            try {
                byte[] decoded = Decoders.BASE64.decode(s);
                if (decoded.length >= 32) {
                    return decoded;
                }
                // If too short, fall through to hashing.
            } catch (Exception ignored) {
                // Fall back to string secret.
            }
        }

        // Fallback: treat as plain text and stretch to 32 bytes with SHA-256.
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            return digest.digest(s.getBytes(StandardCharsets.UTF_8)); // 32 bytes
        } catch (Exception e) {
            throw new IllegalStateException("Failed to derive jwt secret", e);
        }
    }

    private boolean looksLikeBase64(String s) {
        // Quick heuristic: avoid throwing for obvious non-base64 strings.
        // Allow = padding, +, /, _-, and whitespace is trimmed already.
        // If it contains ':' (e.g. URLs) or spaces, treat as non-base64.
        if (s.contains(" ") || s.contains(":")) return false;
        return s.matches("^[A-Za-z0-9+/=_-]+$");
    }
}
