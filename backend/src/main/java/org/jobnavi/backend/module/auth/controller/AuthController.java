package org.jobnavi.backend.module.auth.controller;

import org.jobnavi.backend.common.result.Result;
import org.jobnavi.backend.module.auth.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

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
