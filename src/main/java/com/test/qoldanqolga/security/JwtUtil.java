package com.test.qoldanqolga.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SignatureException;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component
public class JwtUtil {

    private final JwtProperties properties;
    private final SecretKey key;

    public JwtUtil(JwtProperties properties) {
        this.properties = properties;
        this.key = Keys.hmacShaKeyFor(properties.getSecret().getBytes(StandardCharsets.UTF_8));
    }

    public String createToken(String userId, String email) {
        return Jwts.builder()
                .subject(userId)
                .claim("email", email)
                .issuer(properties.getIssuer())
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + properties.getExpirationMs()))
                .signWith(key)
                .compact();
    }

    public Claims parseToken(String token) {
        try {
            return Jwts.parser()
                    .verifyWith(key)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();
        } catch (ExpiredJwtException | SignatureException e) {
            return null;
        }
    }

    public String getUserIdFromToken(String token) {
        Claims claims = parseToken(token);
        if (claims == null) return null;
        return claims.getSubject();
    }
}
