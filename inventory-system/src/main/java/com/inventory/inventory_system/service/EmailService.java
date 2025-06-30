package com.inventory.inventory_system.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private Environment environment;

    /**
     * General-purpose alert email sender
     */
    public void sendAlertEmail(String to, String subject, String body) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(body, false); // false = plain text
            helper.setFrom(getFromAddress());

            mailSender.send(message);
            System.out.println("✅ Alert email sent to: " + to);
        } catch (MessagingException e) {
            System.err.println("❌ Failed to send alert email: " + e.getMessage());
            throw new RuntimeException("Email sending failed: " + e.getMessage());
        }
    }

    /**
     * Supplier-specific email method (optional)
     */
    public void sendEmailToSupplier(String to, String subject, String body) {
        sendAlertEmail(to, subject, body);
    }

    private String getFromAddress() {
        return environment.getProperty("spring.mail.username", "noreply@example.com");
    }
}
