package org.jobnavi.backend.module.auth.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jobnavi.backend.module.auth.entity.User;
import org.jobnavi.backend.module.auth.repository.UserRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class AccountCleanupService {

    private final UserRepository userRepository;

    /**
     * Daily task to permanently delete accounts that have been soft-deleted for more than 7 days.
     * Scheduled to run every day at 03:00 AM server time.
     */
    @Scheduled(cron = "0 0 3 * * ?") // 3:00 AM daily
    @Transactional
    public void cleanupDeletedAccounts() {
        log.info("Starting scheduled account cleanup task...");

        // 7 days grace period
        LocalDateTime threshold = LocalDateTime.now().minusDays(7);
        
        // Find users with status = 1 (soft deleted) and deleteTime older than 7 days
        List<User> usersToDelete = userRepository.findByStatusAndDeleteTimeBefore(1, threshold);

        if (usersToDelete.isEmpty()) {
            log.info("用户注销定时任务没有找到已结束注销冷静期的用户");
            return;
        }

        log.info("发现了符合永久删除条件的 {} 个账户.", usersToDelete.size());

        for (User user : usersToDelete) {
            try {
                // Hard delete
                userRepository.delete(user);
                log.info("永久删除用户: 用户ID={}, 用户名={}", user.getId(), user.getUsername());
            } catch (Exception e) {
                log.error("删除用户信息失败: ID={}", user.getId(), e);
            }
        }

        log.info("用户注销定时任务执行完毕.");
    }
}
