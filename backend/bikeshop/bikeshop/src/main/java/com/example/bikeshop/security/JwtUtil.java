package com.example.bikeshop.security;

import com.example.bikeshop.entity.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {

    private static final String SECRET_KEY = "bikeshop-secret-ThisIsASecretKeyThatIsAtLeast32Chars!";
    private static final long ACCESS_TOKEN_VALIDITY = 1000 * 60 * 60;       // 1 giờ
    private static final long REFRESH_TOKEN_VALIDITY = 1000L * 60 * 60 * 24 * 7; // 7 ngày

    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(SECRET_KEY.getBytes(StandardCharsets.UTF_8));
    }

    // ---------------- Access Token ----------------
    public String generateToken(User user) {
        return generateToken(user, ACCESS_TOKEN_VALIDITY);
    }

    public String generateToken(User user, long validityMs) {
        return Jwts.builder()
                .setSubject(user.getUsername())
                .claim("userId", user.getId())
                .claim("role", user.getRole())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + validityMs))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public boolean validateToken(String token) {
        try {
            Claims claims = extractClaims(token);
            return !claims.getExpiration().before(new Date());
        } catch (Exception e) {
            return false;
        }
    }

    public boolean validateToken(String token, User user) {
        String username = getUsernameFromToken(token);
        return (username.equals(user.getUsername()) && !isTokenExpired(token));
    }

    public boolean isTokenExpired(String token) {
        try {
            return extractClaims(token).getExpiration().before(new Date());
        } catch (Exception e) {
            return true; // token invalid cũng coi là expired
        }
    }

    public String getUsernameFromToken(String token) {
        return extractClaims(token).getSubject();
    }

    public Claims extractClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    // ---------------- Refresh Token ----------------
    public String generateRefreshToken(User user) {
        return generateToken(user, REFRESH_TOKEN_VALIDITY);
    }

    public boolean validateRefreshToken(String token) {
        return validateToken(token);
    }
}
