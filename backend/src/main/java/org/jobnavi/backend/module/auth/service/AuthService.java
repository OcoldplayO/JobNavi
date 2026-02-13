package org.jobnavi.backend.module.auth.service;

import org.jobnavi.backend.common.mail.MailSender;
import org.jobnavi.backend.common.util.JwtUtil;
import org.jobnavi.backend.module.auth.entity.EmailVerificationCode;
import org.jobnavi.backend.module.auth.entity.PasswordResetToken;
import org.jobnavi.backend.module.auth.entity.User;
import org.jobnavi.backend.module.auth.repository.EmailVerificationCodeRepository;
import org.jobnavi.backend.module.auth.repository.PasswordResetTokenRepository;
import org.jobnavi.backend.module.auth.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailVerificationCodeRepository emailCodeRepo;

    @Autowired
    private PasswordResetTokenRepository resetTokenRepo;

    @Autowired
    private MailSender mailSender;

    @Autowired
    private JwtUtil jwtUtil;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    private final SecureRandom secureRandom = new SecureRandom();

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
        String normalizedEmail = normalizeEmail(email);
        if (normalizedEmail == null) {
            throw new RuntimeException("邮箱不能为空");
        }
        if (userRepository.existsByEmail(normalizedEmail)) {
            throw new RuntimeException("该邮箱已被注册");
        }

        if (!password.matches("^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{9,}$")) {
            throw new RuntimeException("密码强度不足：需9位以上，包含字母、数字及特殊符号");
        }

        String tempUsername = normalizedEmail.split("@")[0] + "_" + System.currentTimeMillis();

        User user = new User();
        user.setEmail(normalizedEmail);
        user.setUsername(tempUsername);
        user.setPassword(passwordEncoder.encode(password));
        user.setNickname(normalizedEmail.split("@")[0]);

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

        // Username-only accounts must bind email before login (MVP requirement)
        if (user.getEmail() == null || user.getEmail().isBlank()) {
            throw new RuntimeException("请先完成邮箱验证（绑定邮箱后才能登录）");
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

    /**
     * Sliding refresh: if current token is valid (not expired), issue a new token with a fresh expiration.
     * MVP: We only ensure the user still exists and is not disabled.
     */
    public Map<String, Object> refreshToken(String token) {
        if (token == null || token.isBlank()) {
            throw new RuntimeException("token不能为空");
        }

        Long userId = jwtUtil.extractUserId(token);
        String username = jwtUtil.extractUsername(token);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("用户不存在"));

        if (user.getStatus() != null && user.getStatus() != 0) {
            throw new RuntimeException("账号状态异常");
        }

        // Optional: ensure username matches to avoid weird tokens
        if (user.getUsername() != null && username != null && !user.getUsername().equals(username)) {
            throw new RuntimeException("token不匹配");
        }

        String newToken = jwtUtil.generateToken(user.getId(), user.getUsername());
        long expiresAt = System.currentTimeMillis() + jwtUtil.getExpirationMs();

        Map<String, Object> res = new HashMap<>();
        res.put("token", newToken);
        res.put("expiresAt", expiresAt);
        return res;
    }

    /**
     * Send email verification code (MVP: log to console).
     * scene: BIND_EMAIL / RESET_PASSWORD / REGISTER (reserved)
     */
    @Transactional
    public void sendEmailCode(String email, String scene) {
        String normalizedEmail = normalizeEmail(email);
        if (normalizedEmail == null) {
            throw new RuntimeException("邮箱不能为空");
        }
        if (scene == null || scene.isBlank()) {
            throw new RuntimeException("scene不能为空");
        }

        String code = String.format("%06d", secureRandom.nextInt(1_000_000));
        String codeHash = sha256Hex(code + "|" + normalizedEmail + "|" + scene);

        EmailVerificationCode entity = new EmailVerificationCode();
        entity.setEmail(normalizedEmail);
        entity.setScene(scene);
        entity.setCodeHash(codeHash);
        entity.setExpireTime(LocalDateTime.now().plusMinutes(10));
        entity.setUsed(0);
        emailCodeRepo.save(entity);

        // MVP: send to backend console
        mailSender.send(
                normalizedEmail,
                "JobNavi 邮箱验证码",
                "您的验证码是: " + code + "\n\n10分钟内有效。\n\n场景: " + scene
        );
    }

    /**
     * Bind email for username account by verifying code (no auth token yet).
     * This is the required step after username registration.
     */
    @Transactional
    public void verifyAndBindEmail(String username, String email, String code) {
        if (username == null || username.isBlank()) {
            throw new RuntimeException("用户名不能为空");
        }
        String normalizedEmail = normalizeEmail(email);
        if (normalizedEmail == null) {
            throw new RuntimeException("邮箱不能为空");
        }
        if (code == null || code.isBlank()) {
            throw new RuntimeException("验证码不能为空");
        }

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("用户不存在"));

        // Prevent binding already-used email
        if (userRepository.existsByEmail(normalizedEmail)) {
            throw new RuntimeException("该邮箱已被占用");
        }

        EmailVerificationCode latest = emailCodeRepo
                .findFirstByEmailAndSceneAndUsedOrderByIdDesc(normalizedEmail, "BIND_EMAIL", 0)
                .orElseThrow(() -> new RuntimeException("验证码不存在或已使用，请重新发送"));

        if (latest.getExpireTime() == null || latest.getExpireTime().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("验证码已过期，请重新发送");
        }

        String expectedHash = sha256Hex(code + "|" + normalizedEmail + "|" + "BIND_EMAIL");
        if (!expectedHash.equalsIgnoreCase(latest.getCodeHash())) {
            throw new RuntimeException("验证码错误");
        }

        latest.setUsed(1);
        latest.setUsedTime(LocalDateTime.now());
        emailCodeRepo.save(latest);

        user.setEmail(normalizedEmail);
        user.setEmailVerified(1);
        user.setEmailVerifiedTime(LocalDateTime.now());
        userRepository.save(user);
    }

    /**
     * Forgot password - request reset email link.
     * For security, the caller should always receive success message even if email not found.
     */
    @Transactional
    public void requestPasswordReset(String email) {
        String normalizedEmail = normalizeEmail(email);
        if (normalizedEmail == null) {
            return;
        }

        Optional<User> userOpt = userRepository.findByEmail(normalizedEmail);
        if (userOpt.isEmpty()) {
            return; // do not reveal existence
        }
        User user = userOpt.get();

        String token = generateUrlSafeToken();
        String tokenHash = sha256Hex(token);

        PasswordResetToken entity = new PasswordResetToken();
        entity.setUserId(user.getId());
        entity.setEmail(normalizedEmail);
        entity.setTokenHash(tokenHash);
        entity.setExpireTime(LocalDateTime.now().plusMinutes(30));
        entity.setUsed(0);
        resetTokenRepo.save(entity);

        String resetLink = "http://localhost:3000/reset-password?token=" + token;

        // MVP: send to backend console
        mailSender.send(
                normalizedEmail,
                "JobNavi 重置密码",
                "请点击以下链接重置密码（30分钟内有效）：\n\n" + resetLink + "\n\n如果不是您本人操作，请忽略此邮件。"
        );
    }

    /**
     * Confirm reset password by token.
     */
    @Transactional
    public void confirmPasswordReset(String token, String newPassword) {
        if (token == null || token.isBlank()) {
            throw new RuntimeException("token不能为空");
        }
        if (newPassword == null || newPassword.isBlank()) {
            throw new RuntimeException("新密码不能为空");
        }
        if (!newPassword.matches("^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{9,}$")) {
            throw new RuntimeException("密码强度不足：需9位以上，包含字母、数字及特殊符号");
        }

        String tokenHash = sha256Hex(token);
        PasswordResetToken entity = resetTokenRepo.findFirstByTokenHashAndUsed(tokenHash, 0)
                .orElseThrow(() -> new RuntimeException("链接无效或已使用"));

        if (entity.getExpireTime() == null || entity.getExpireTime().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("链接已过期，请重新发起重置");
        }

        User user = userRepository.findById(entity.getUserId())
                .orElseThrow(() -> new RuntimeException("用户不存在"));

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        entity.setUsed(1);
        entity.setUsedTime(LocalDateTime.now());
        resetTokenRepo.save(entity);
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

    private String normalizeEmail(String email) {
        if (email == null) return null;
        String e = email.trim().toLowerCase();
        return e.isEmpty() ? null : e;
    }

    private String generateUrlSafeToken() {
        byte[] bytes = new byte[32];
        secureRandom.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }

    private String sha256Hex(String input) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(input.getBytes(StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder(hash.length * 2);
            for (byte b : hash) {
                sb.append(String.format("%02x", b));
            }
            return sb.toString();
        } catch (Exception e) {
            throw new RuntimeException("hash失败");
        }
    }
}
