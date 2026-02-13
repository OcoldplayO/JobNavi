package org.jobnavi.backend.common.mail;

public interface MailSender {
    void send(String to, String subject, String body);
}

