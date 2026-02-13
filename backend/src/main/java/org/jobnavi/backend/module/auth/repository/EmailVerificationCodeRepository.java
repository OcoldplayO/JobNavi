package org.jobnavi.backend.module.auth.repository;

import org.jobnavi.backend.module.auth.entity.EmailVerificationCode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface EmailVerificationCodeRepository extends JpaRepository<EmailVerificationCode, Long> {

    Optional<EmailVerificationCode> findFirstByEmailAndSceneAndUsedOrderByIdDesc(String email, String scene, Integer used);

    long deleteByExpireTimeBefore(LocalDateTime time);
}

