package org.jobnavi.backend.common.mail;

import org.springframework.stereotype.Component;

/**
 * MVP: do NOT send real emails yet.
 * We log the email content to backend console for debugging.
 *
 * TODO: Replace with real email provider (SMTP/SendGrid/Mailgun/阿里云邮件推送等)
 */
@Component
public class ConsoleMailSender implements MailSender {
    @Override
    public void send(String to, String subject, String body) {
        System.out.println("========== [JobNavi Mail Stub] ==========");
        System.out.println("TO: " + to);
        System.out.println("SUBJECT: " + subject);
        System.out.println("BODY:\n" + body);
        System.out.println("========================================");
    }
}

