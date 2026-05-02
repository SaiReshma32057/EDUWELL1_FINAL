package com.eduwell.backendnew.service;

import com.eduwell.backendnew.entity.Notification;
import com.eduwell.backendnew.entity.User;
import com.eduwell.backendnew.repository.NotificationRepository;
import com.eduwell.backendnew.repository.UserRepository;
import java.util.Collections;
import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    public NotificationService(NotificationRepository notificationRepository, UserRepository userRepository) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
    }

    public void notifyAllStudents(String message) {
        List<User> students = userRepository.findByRoleIgnoreCase("STUDENT");
        for (User student : students) {
            notificationRepository.save(new Notification(null, message, student.getId(), false));
        }
    }

    public List<Notification> getNotifications(Long userId) {
        try {
            return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
        } catch (Exception ex) {
            return Collections.emptyList();
        }
    }

    public List<Notification> getAdminUpdates(Long userId) {
        List<Notification> notifications = getNotifications(userId);
        return notifications.stream()
                .filter(notification -> {
                    String message = notification.getMessage();
                    if (message == null) {
                        return false;
                    }
                    return message.toLowerCase(Locale.ROOT).startsWith("new update by admin");
                })
                .collect(Collectors.toList());
    }

    public long countUnread(Long userId) {
        return notificationRepository.countByUserIdAndIsReadFalse(userId);
    }

    public Notification markRead(Long notificationId, Long userId) {
        Notification notification = notificationRepository.findByIdAndUserId(notificationId, userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Notification not found"));
        notification.setIsRead(true);
        return notificationRepository.save(notification);
    }
}
