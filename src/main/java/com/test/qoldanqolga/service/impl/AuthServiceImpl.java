package com.test.qoldanqolga.service.impl;

import com.test.qoldanqolga.dto.auth.AuthResponse;
import com.test.qoldanqolga.dto.auth.LoginRequest;
import com.test.qoldanqolga.dto.auth.RegisterRequest;
import com.test.qoldanqolga.dto.auth.UpdateProfileRequest;
import com.test.qoldanqolga.dto.auth.UserInfo;
import com.test.qoldanqolga.exception.ConflictException;
import com.test.qoldanqolga.exception.InvalidCredentialsException;
import com.test.qoldanqolga.mapper.UserMapper;
import com.test.qoldanqolga.model.User;
import com.test.qoldanqolga.repository.UserRepository;
import com.test.qoldanqolga.security.JwtUtil;
import com.test.qoldanqolga.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final UserMapper userMapper;

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ConflictException("Пользователь с таким email уже зарегистрирован");
        }
        User user = userMapper.toUser(request);
        user.setEmail(request.getEmail().trim().toLowerCase());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setDisplayName(request.getDisplayName().trim());
        user = userRepository.save(user);
        return userMapper.toAuthResponse(user, jwtUtil.createToken(user.getId(), user.getEmail()));
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail().trim().toLowerCase())
                .orElseThrow(() -> new InvalidCredentialsException("Неверный email или пароль"));
        if (user.isDeleted()) {
            throw new InvalidCredentialsException("Аккаунт недоступен");
        }
        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new InvalidCredentialsException("Неверный email или пароль");
        }
        return userMapper.toAuthResponse(user, jwtUtil.createToken(user.getId(), user.getEmail()));
    }

    @Override
    public UserInfo getCurrentUser(String userId) {
        return userRepository.findById(userId)
                .filter(u -> !u.isDeleted())
                .map(userMapper::toDto)
                .orElse(null);
    }

    @Override
    @Transactional
    public UserInfo updateProfile(String userId, UpdateProfileRequest request) {
        User user = userRepository.findById(userId)
                .filter(u -> !u.isDeleted())
                .orElse(null);
        if (user == null) return null;
        user.setDisplayName(request.getDisplayName().trim());
        String newEmail = request.getEmail() != null ? request.getEmail().trim().toLowerCase() : null;
        if (newEmail != null && !newEmail.equals(user.getEmail())) {
            if (userRepository.existsByEmail(newEmail)) {
                throw new ConflictException("Пользователь с таким email уже зарегистрирован");
            }
            user.setEmail(newEmail);
        }
        String av = request.getAvatar();
        user.setAvatar(av != null && !av.isBlank() && av.length() <= 512 ? av.trim() : null);
        userRepository.save(user);
        return userMapper.toDto(user);
    }
}
