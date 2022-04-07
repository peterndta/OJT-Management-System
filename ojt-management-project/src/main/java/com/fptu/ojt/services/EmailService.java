package com.fptu.ojt.services;

import javax.mail.MessagingException;

public interface EmailService {
    void sendSimpleMessage(String to, String subject, String text);

    void sendMessageWithAttachment(String to, String subject, String text, String pathToAttachment) throws MessagingException;

    void sendMessage(String to, String subject, String html) throws MessagingException;
}
