package org.jobnavi.backend.module.auth.controller;

import org.jobnavi.backend.common.result.Result;
import org.jobnavi.backend.common.util.JwtUtil;
import org.jobnavi.backend.module.auth.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private JwtUtil jwtUtil;

    // TODO: Google 登录/注册（OAuth2）
    // TODO: 微信扫码登录
    // TODO: 短信验证码登录（需要第三方付费服务）

    @PostMapping("/login")
    public Result<Map<String, Object>> login(@RequestBody Map<String, String> body) {
        String account = body.get("account");
        String password = body.get("password");
        try {
            return Result.success(authService.login(account, password));
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    @PostMapping("/email/code/send")
    public Result<String> sendEmailCode(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String scene = body.get("scene"); // BIND_EMAIL / RESET_PASSWORD / REGISTER(reserved)
        try {
            authService.sendEmailCode(email, scene);
            return Result.success("验证码已发送（MVP：请查看后端控制台日志）");
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    @PostMapping("/email/bind/verify")
    public Result<String> verifyBindEmail(@RequestBody Map<String, String> body) {
        String username = body.get("username");
        String email = body.get("email");
        String code = body.get("code");
        try {
            authService.verifyAndBindEmail(username, email, code);
            return Result.success("邮箱绑定成功");
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    @PostMapping("/password/reset/request")
    public Result<String> requestReset(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        try {
            authService.requestPasswordReset(email);
            // Always return success to avoid user enumeration
            return Result.success("如果该邮箱绑定已有账号，您将收到密码重置链接（MVP：请查看后端控制台日志）");
        } catch (Exception e) {
            // Still return success to avoid enumeration
            return Result.success("如果该邮箱绑定已有账号，您将收到密码重置链接（MVP：请查看后端控制台日志）");
        }
    }

    @PostMapping("/password/reset/confirm")
    public Result<String> confirmReset(@RequestBody Map<String, String> body) {
        String token = body.get("token");
        String newPassword = body.get("newPassword");
        try {
            authService.confirmPasswordReset(token, newPassword);
            return Result.success("密码已重置，请使用新密码登录");
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    /**
     * Debug endpoint for verifying JWT across backend restarts.
     * TODO: Remove or protect it after auth middleware is in place.
     */
    @PostMapping("/token/verify")
    public Result<Map<String, Object>> verifyToken(@RequestBody Map<String, String> body) {
        String token = body.get("token");
        try {
            Long userId = jwtUtil.extractUserId(token);
            String username = jwtUtil.extractUsername(token);
            return Result.success(Map.of(
                    "valid", true,
                    "userId", userId,
                    "username", username
            ));
        } catch (Exception e) {
            return Result.error("token无效：" + e.getMessage());
        }
    }

    /**
     * Sliding refresh endpoint.
     * Client sends current token and receives a new token with refreshed expiration.
     *
     * TODO: After auth middleware is in place, prefer reading token from Authorization header.
     */
    @PostMapping("/token/refresh")
    public Result<Map<String, Object>> refreshToken(@RequestBody Map<String, String> body) {
        String token = body.get("token");
        try {
            return Result.success(authService.refreshToken(token));
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    @PostMapping("/register/username")
    public Result<Map<String, Object>> registerUsername(@RequestBody Map<String, String> body) {
        String username = body.get("username");
        String password = body.get("password");
        try {
            return Result.success(authService.registerByUsername(username, password));
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    @PostMapping("/register/email")
    public Result<Map<String, Object>> registerEmail(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String password = body.get("password");
        try {
            return Result.success(authService.registerByEmail(email, password));
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    @DeleteMapping("/account")
    public Result<String> deactivate(@RequestBody Map<String, Long> body) {
        Long userId = body.get("userId");
        try {
            authService.deactivateAccount(userId);
            return Result.success("账号注销申请已提交，7天内登录可自动撤销");
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }
}
