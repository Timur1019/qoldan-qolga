package com.test.qoldanqolga.security;

import com.test.qoldanqolga.model.User;
import com.test.qoldanqolga.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

/**
 * Предоставляет UserDetailsService из нашей БД.
 * Отключает дефолтного пользователя Spring с сгенерированным паролем.
 */
@Service
@RequiredArgsConstructor
public class AppUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findById(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
        if (user.isDeleted()) {
            throw new UsernameNotFoundException("User deleted: " + username);
        }
        return new UserPrincipal(user);
    }
}
