package com.inventory.inventory_system.controller;

import com.inventory.inventory_system.dto.EmailRequest;
import com.inventory.inventory_system.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/email")
public class EmailController {

    @Autowired
    private EmailService emailService;

    @PostMapping("/send")
    public String sendEmail(@RequestBody EmailRequest request) {
        try {
            emailService.sendAlertEmail(request.getTo(), request.getSubject(), request.getBody());
            return "✅ Email sent successfully";
        } catch (Exception e) {
            return "❌ Failed to send email: " + e.getMessage();
        }
    }
}
