package com.test.qoldanqolga.config;

import com.test.qoldanqolga.security.JwtAuthFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers("/swagger-ui/**", "/swagger-ui.html", "/v3/api-docs/**").permitAll()
                        .requestMatchers("/api/auth/**", "/api/health").permitAll()
                        .requestMatchers("/ws", "/ws/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/regions", "/api/categories", "/api/categories/**", "/api/brands", "/api/brands/**", "/api/vehicle-spec-options").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/ads/**").permitAll()
                        .requestMatchers(request ->
                                "POST".equalsIgnoreCase(request.getMethod())
                                        && request.getRequestURI() != null
                                        && request.getRequestURI().matches(".*/api/ads/[^/]+/view"))
                                .permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/users/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/regions", "/api/categories", "/api/categories/home").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/home-promo-banners").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/site-top-banners").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/home-sell-banners").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/ad-sidebar-banners").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/currency/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/business-applications").permitAll()
                        .requestMatchers("/api/payments/payme", "/api/payments/click/**").permitAll()
                        .requestMatchers("/uploads/**").permitAll()
                        .requestMatchers("/docs/**").permitAll()
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")
                        .requestMatchers("/api/**").authenticated()
                        .anyRequest().permitAll())
                .exceptionHandling(ex -> ex
                        .authenticationEntryPoint(api401EntryPoint())
                        .accessDeniedHandler(api403AccessDeniedHandler()))
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    @Bean
    public AuthenticationEntryPoint api401EntryPoint() {
        return (request, response, authException) -> {
            if (request.getRequestURI().startsWith("/api/")) {
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.setContentType("application/json;charset=UTF-8");
                response.getWriter().write("{\"code\":\"UNAUTHORIZED\",\"status\":401,\"message\":\"Требуется авторизация\"}");
            } else {
                response.sendError(HttpServletResponse.SC_FORBIDDEN, authException.getMessage());
            }
        };
    }

    /** При 403 для /api/* возвращаем JSON с понятным текстом (роль не ADMIN). */
    @Bean
    public AccessDeniedHandler api403AccessDeniedHandler() {
        return (request, response, accessDeniedException) -> {
            if (request.getRequestURI().startsWith("/api/")) {
                response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                response.setContentType("application/json;charset=UTF-8");
                response.getWriter().write("{\"code\":\"FORBIDDEN\",\"status\":403,\"message\":\"Доступ запрещён: требуется роль ADMIN\"}");
            } else {
                response.sendError(HttpServletResponse.SC_FORBIDDEN, accessDeniedException.getMessage());
            }
        };
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOriginPatterns(List.of(
                "http://localhost:*",
                "http://127.0.0.1:*",
                "https://*.trycloudflare.com",
                "http://qoldan-qolga.uz",
                "https://qoldan-qolga.uz",
                "http://www.qoldan-qolga.uz",
                "https://www.qoldan-qolga.uz",
                "http://5.182.26.233:*"
        ));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "HEAD"));
        config.setAllowedHeaders(List.of("*"));
        config.setExposedHeaders(List.of("Authorization"));
        config.setAllowCredentials(true);
        config.setMaxAge(3600L);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
