package com.eduwell.backendnew.controller;

import com.eduwell.backendnew.dto.ApiResponse;
import com.eduwell.backendnew.entity.Notification;
import com.eduwell.backendnew.service.NotificationService;
import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping("/{userId}")
    public ResponseEntity<ApiResponse> getNotifications(@PathVariable Long userId) {
        return ResponseEntity.ok(new ApiResponse(
                "success",
                "Notifications fetched successfully",
                notificationService.getNotifications(userId)));
    }

    @GetMapping("/{userId}/admin-updates")
    public ResponseEntity<ApiResponse> getAdminUpdates(@PathVariable Long userId) {
        return ResponseEntity.ok(new ApiResponse(
                "success",
                "Admin updates fetched successfully",
                notificationService.getAdminUpdates(userId)));
    }

    @PutMapping("/read/{id}")
    public ResponseEntity<Map<String, Object>> markRead(@PathVariable Long id,
                                @RequestHeader("x-user-id") Long userId) {
        Notification notification = notificationService.markRead(id, userId);
        return ResponseEntity.ok(Map.of(
                "status", "success",
                "message", "Notification marked as read",
                "data", notification));
    }
}
