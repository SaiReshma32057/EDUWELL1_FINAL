package com.eduwell.backendnew.service;

import com.eduwell.backendnew.entity.User;
import com.eduwell.backendnew.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class SubmissionEmailService {

    private static final Logger log = LoggerFactory.getLogger(SubmissionEmailService.class);

    private final UserRepository userRepository;
    private final JavaMailSender mailSender;

    @Value("${app.email.enabled:false}")
    private boolean emailEnabled;

    @Value("${app.email.from:no-reply@eduwell.local}")
    private String fromEmail;
    
    @Value("${app.email.admin:}")
    private String adminEmail;

    public SubmissionEmailService(UserRepository userRepository, JavaMailSender mailSender) {
        this.userRepository = userRepository;
        this.mailSender = mailSender;
    }

    public void sendSubmissionSuccessEmail(Long userId, String submissionType) {
        if (!emailEnabled) {
            return;
        }

        User user = userRepository.findById(userId).orElse(null);
        if (user == null || user.getEmail() == null || user.getEmail().isBlank()) {
            return;
        }

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(user.getEmail());
        message.setSubject("EduWell Submission Successful");
        message.setText(buildBody(user.getName(), submissionType));

        try {
            mailSender.send(message);
        } catch (Exception ex) {
            log.warn("Unable to send submission success email to userId {}: {}", userId, ex.getMessage());
        }
    }

    public void sendSignupSuccessEmail(User user) {
        sendAuthEmail(user, "EduWell Signup Successful", "signup");
        // notify admin/site owner about new signup (if configured)
        if (adminEmail != null && !adminEmail.isBlank()) {
            try {
                SimpleMailMessage adminMsg = new SimpleMailMessage();
                adminMsg.setFrom(fromEmail);
                adminMsg.setTo(adminEmail);
                adminMsg.setSubject("New EduWell registration: " + (user.getEmail() == null ? "(unknown)" : user.getEmail()));
                adminMsg.setText("A new user has registered:\n\n"
                        + "Id: " + user.getId() + "\n"
                        + "Name: " + (user.getName() == null ? "(none)" : user.getName()) + "\n"
                        + "Email: " + (user.getEmail() == null ? "(none)" : user.getEmail()) + "\n"
                        + "Role: " + (user.getRole() == null ? "STUDENT" : user.getRole()) + "\n"
                );
                mailSender.send(adminMsg);
            } catch (Exception ex) {
                log.warn("Unable to send admin notification for signup (userId {}): {}", user.getId(), ex.getMessage());
            }
        }
    }

    public void sendLoginSuccessEmail(User user) {
        sendAuthEmail(user, "EduWell Login Successful", "login");
    }

    private void sendAuthEmail(User user, String subject, String actionType) {
        if (!emailEnabled || user == null || user.getEmail() == null || user.getEmail().isBlank()) {
            return;
        }

        String safeName = (user.getName() == null || user.getName().isBlank()) ? "Student" : user.getName();

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(user.getEmail());
        message.setSubject(subject);
        message.setText("Hi " + safeName + ",\n\n"
                + "Your " + actionType + " was successful.\n"
                + "Thank you for using EduWell.\n\n"
                + "- EduWell Team");

        try {
            mailSender.send(message);
        } catch (Exception ex) {
            log.warn("Unable to send {} success email to userId {}: {}", actionType, user.getId(), ex.getMessage());
        }
    }

    private String buildBody(String name, String submissionType) {
        String safeName = (name == null || name.isBlank()) ? "Student" : name;
        return "Hi " + safeName + ",\n\n"
                + "Your " + submissionType + " submission was successful.\n"
                + "Thank you for using EduWell.\n\n"
                + "- EduWell Team";
    }
}
