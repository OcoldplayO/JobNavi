package org.jobnavi.backend.module.auth.service;

import org.jobnavi.backend.common.util.JwtUtil;
import org.jobnavi.backend.module.auth.entity.User;
import org.jobnavi.backend.module.auth.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    // REGISTER: Username
    @Transactional
    public Map<String, Object> registerByUsername(String username, String password) {
        if (userRepository.existsByUsername(username)) {
            throw new RuntimeException("用户名已存在");
        }

        if (!password.matches("^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{9,}$")) {
            throw new RuntimeException("密码强度不足：需9位以上，包含字母、数字及特殊符号");
        }

        User user = new User();
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(password));
        user.setNickname(username);

        userRepository.save(user);
        return generateLoginResponse(user);
    }

    // REGISTER: Email
    @Transactional
    public Map<String, Object> registerByEmail(String email, String password) {
        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("该邮箱已被注册");
        }

        String tempUsername = email.split("@")[0] + "_" + System.currentTimeMillis();

        User user = new User();
        user.setEmail(email);
        user.setUsername(tempUsername);
        user.setPassword(passwordEncoder.encode(password));
        user.setNickname(email.split("@")[0]);

        userRepository.save(user);
        return generateLoginResponse(user);
    }

    // LOGIN
    public Map<String, Object> login(String account, String password) {
        Optional<User> userOpt = userRepository.findByUsername(account);
        if (userOpt.isEmpty()) {
            userOpt = userRepository.findByEmail(account);
        }

        if (userOpt.isEmpty()) {
            throw new RuntimeException("账号不存在");
        }

        User user = userOpt.get();

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("密码错误");
        }

        if (user.getStatus() != null && user.getStatus() != 0) {
            if (user.getStatus() == 1) {
                user.setStatus(0);
                user.setDeleteTime(null);
                userRepository.save(user);
            } else {
                throw new RuntimeException("账号状态异常");
            }
        }

        return generateLoginResponse(user);
    }

    // DEACTIVATE
    @Transactional
    public void deactivateAccount(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("用户不存在"));

        user.setStatus(1);
        user.setDeleteTime(LocalDateTime.now());
        userRepository.save(user);
    }

    private Map<String, Object> generateLoginResponse(User user) {
        String token = jwtUtil.generateToken(user.getId(), user.getUsername());
        Map<String, Object> res = new HashMap<>();
        res.put("token", token);

        Map<String, Object> userInfo = new HashMap<>();
        userInfo.put("id", user.getId());
        userInfo.put("username", user.getUsername());
        userInfo.put("nickname", user.getNickname() != null ? user.getNickname() : user.getUsername());
        res.put("user", userInfo);

        return res;
    }
}
