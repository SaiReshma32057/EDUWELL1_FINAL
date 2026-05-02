package com.eduwell.backendnew.service;

import com.eduwell.backendnew.dto.AnnouncementRequest;
import com.eduwell.backendnew.dto.ResourceUpsertRequest;
import com.eduwell.backendnew.entity.ResourceItem;
import com.eduwell.backendnew.entity.User;
import com.eduwell.backendnew.repository.AppointmentRepository;
import com.eduwell.backendnew.repository.EnrollmentRepository;
import com.eduwell.backendnew.repository.ProgramRepository;
import com.eduwell.backendnew.repository.JournalRepository;
import com.eduwell.backendnew.repository.ResourceRepository;
import com.eduwell.backendnew.repository.SleepRepository;
import com.eduwell.backendnew.repository.UserRepository;
import java.util.List;
import java.util.Map;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.Set;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

@Service
public class ResourceService {

    private final ResourceRepository resourceRepository;
    private final UserRepository userRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final ProgramRepository programRepository;
    private final AppointmentRepository appointmentRepository;
    private final SleepRepository sleepRepository;
    private final JournalRepository journalRepository;
    private final NotificationService notificationService;

    public ResourceService(ResourceRepository resourceRepository,
                           UserRepository userRepository,
                           EnrollmentRepository enrollmentRepository,
                           ProgramRepository programRepository,
                           AppointmentRepository appointmentRepository,
                           SleepRepository sleepRepository,
                           JournalRepository journalRepository,
                           NotificationService notificationService) {
        this.resourceRepository = resourceRepository;
        this.userRepository = userRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.programRepository = programRepository;
        this.appointmentRepository = appointmentRepository;
        this.sleepRepository = sleepRepository;
        this.journalRepository = journalRepository;
        this.notificationService = notificationService;
    }

    public List<ResourceItem> getResources() {
        return resourceRepository.findByIsPublishedTrueOrderByUpdatedAtDesc();
    }

    public List<ResourceItem> getRecentNewFeatures() {
        return resourceRepository.findTop5ByIsPublishedTrueAndIsNewFeatureTrueOrderByUpdatedAtDesc();
    }

    public List<ResourceItem> getAdminResources(Long adminUserId) {
        validateAdmin(adminUserId);
        return resourceRepository.findAllByOrderByUpdatedAtDesc();
    }

    public ResourceItem createResource(Long adminUserId, ResourceUpsertRequest request) {
        validateAdmin(adminUserId);
        ResourceItem resource = new ResourceItem();
        applyUpsert(resource, request);
        resource.setUsageCount(0L);
        resource.setIsNewFeature(true);
        ResourceItem saved = resourceRepository.save(resource);
        notificationService.notifyAllStudents("New article available: " + saved.getTitle());
        return saved;
    }

    public ResourceItem updateResource(Long adminUserId, Long resourceId, ResourceUpsertRequest request) {
        validateAdmin(adminUserId);
        ResourceItem resource = resourceRepository.findById(resourceId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Resource not found"));
        applyUpsert(resource, request);
        resource.setIsNewFeature(true);
        ResourceItem saved = resourceRepository.save(resource);
        notificationService.notifyAllStudents("New article available: " + saved.getTitle());
        return saved;
    }

    public void deleteResource(Long adminUserId, Long resourceId) {
        validateAdmin(adminUserId);
        if (!resourceRepository.existsById(resourceId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Resource not found");
        }
        resourceRepository.deleteById(resourceId);
    }

    public void trackResourceUsage(Long resourceId) {
        ResourceItem resource = resourceRepository.findById(resourceId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Resource not found"));

        Long usageCount = resource.getUsageCount() == null ? 0L : resource.getUsageCount();
        resource.setUsageCount(usageCount + 1);
        resourceRepository.save(resource);
    }

    public Map<String, Object> getAdminDashboardSummary(Long adminUserId) {
        validateAdmin(adminUserId);

        long totalUsers = userRepository.count();
        long totalStudents = userRepository.countByRoleIgnoreCase("STUDENT");
        long totalSessions = programRepository.count();
        long totalResources = resourceRepository.count();
        long totalEnrollments = enrollmentRepository.count();
        long totalAppointments = appointmentRepository.count();
        long totalCounselors = appointmentRepository.countDistinctCounselors();
        Set<Long> activeUserIds = new HashSet<>();
        enrollmentRepository.findAll().forEach(enrollment -> activeUserIds.add(enrollment.getUserId()));
        appointmentRepository.findAll().forEach(appointment -> activeUserIds.add(appointment.getUserId()));
        sleepRepository.findAll().forEach(entry -> activeUserIds.add(entry.getUserId()));
        journalRepository.findAll().forEach(entry -> activeUserIds.add(entry.getUserId()));
        long activeUsers = activeUserIds.size();
        long totalResourceUsage = resourceRepository.findAll().stream()
                .mapToLong(resource -> resource.getUsageCount() == null ? 0L : resource.getUsageCount())
                .sum();

        List<Map<String, Object>> resourceUsage = resourceRepository.findTop5ByOrderByUsageCountDesc().stream()
                .map(resource -> {
                    Map<String, Object> item = new LinkedHashMap<>();
                    item.put("id", resource.getId());
                    item.put("title", resource.getTitle());
                    item.put("usageCount", resource.getUsageCount() == null ? 0L : resource.getUsageCount());
                    item.put("category", resource.getCategory());
                    return item;
                })
                .collect(Collectors.toList());

        List<Map<String, Object>> recentUpdates = resourceRepository.findAllByOrderByUpdatedAtDesc().stream()
                .limit(6)
                .map(resource -> {
                    Map<String, Object> item = new LinkedHashMap<>();
                    item.put("id", resource.getId());
                    item.put("title", resource.getTitle());
                    item.put("category", resource.getCategory());
                    item.put("type", resource.getType());
                    item.put("updatedAt", resource.getUpdatedAt());
                    item.put("createdAt", resource.getCreatedAt());
                    item.put("isNewFeature", resource.getIsNewFeature() != null && resource.getIsNewFeature());
                    return item;
                })
                .collect(Collectors.toList());

        List<Map<String, Object>> recentActivities = new ArrayList<>();
        programRepository.findAll().stream()
            .filter(program -> program.getCreatedAt() != null)
            .forEach(program -> {
                Map<String, Object> item = new LinkedHashMap<>();
                item.put("title", "Session added");
                item.put("message", program.getTitle());
                item.put("timestamp", program.getCreatedAt());
                item.put("type", "session");
                recentActivities.add(item);
            });

        resourceRepository.findAll().stream()
            .filter(resource -> resource.getCreatedAt() != null)
            .forEach(resource -> {
                Map<String, Object> item = new LinkedHashMap<>();
                item.put("title", "Article published");
                item.put("message", resource.getTitle());
                item.put("timestamp", resource.getCreatedAt());
                item.put("type", "resource");
                recentActivities.add(item);
            });

        userRepository.findTop5ByOrderByCreatedAtDesc().stream()
            .filter(user -> user.getCreatedAt() != null)
            .forEach(user -> {
                Map<String, Object> item = new LinkedHashMap<>();
                item.put("title", "User registered");
                item.put("message", user.getName());
                item.put("timestamp", user.getCreatedAt());
                item.put("type", user.getRole());
                recentActivities.add(item);
            });

        recentActivities.sort(Comparator.comparing(
            (Map<String, Object> activity) -> (java.time.LocalDateTime) activity.get("timestamp"),
            Comparator.nullsLast(Comparator.naturalOrder())
        ).reversed());

        Map<String, Object> summary = new LinkedHashMap<>();
        summary.put("totalUsers", totalUsers);
        summary.put("totalStudents", totalStudents);
        summary.put("totalSessions", totalSessions);
        summary.put("totalResources", totalResources);
        summary.put("totalEnrollments", totalEnrollments);
        summary.put("totalAppointments", totalAppointments);
        summary.put("totalCounselors", totalCounselors);
        summary.put("activeUsers", activeUsers);
        summary.put("totalResourceUsage", totalResourceUsage);
        summary.put("resourceUsage", resourceUsage);
        summary.put("recentUpdates", recentUpdates);
        summary.put("recentActivities", recentActivities.stream().limit(8).collect(Collectors.toList()));
        return summary;
    }

    public Map<String, Object> getAdminUsersSummary(Long adminUserId) {
        validateAdmin(adminUserId);

        long totalUsers = userRepository.count();
        long totalStudents = userRepository.countByRoleIgnoreCase("STUDENT");
        long totalAdmins = userRepository.countByRoleIgnoreCase("ADMIN");

        List<Map<String, Object>> users = userRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(user -> {
                    Map<String, Object> item = new LinkedHashMap<>();
                    item.put("id", user.getId());
                    item.put("name", user.getName());
                    item.put("email", user.getEmail());
                    item.put("role", user.getRole());
                    item.put("age", user.getAge());
                    item.put("createdAt", user.getCreatedAt());
                    return item;
                })
                .collect(Collectors.toList());

        List<Map<String, Object>> recentUsers = userRepository.findTop5ByOrderByCreatedAtDesc().stream()
                .map(user -> {
                    Map<String, Object> item = new LinkedHashMap<>();
                    item.put("id", user.getId());
                    item.put("name", user.getName());
                    item.put("email", user.getEmail());
                    item.put("role", user.getRole());
                    item.put("age", user.getAge());
                    item.put("createdAt", user.getCreatedAt());
                    return item;
                })
                .collect(Collectors.toList());

        Map<String, Object> summary = new LinkedHashMap<>();
        summary.put("totalUsers", totalUsers);
        summary.put("totalStudents", totalStudents);
        summary.put("totalAdmins", totalAdmins);
        summary.put("users", users);
        summary.put("recentUsers", recentUsers);
        return summary;
    }

    private User validateAdmin(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));
        if (!"admin".equalsIgnoreCase(user.getRole())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only admin users can perform this action");
        }
        return user;
    }

    private void applyUpsert(ResourceItem resource, ResourceUpsertRequest request) {
        resource.setTitle(request.getTitle().trim());
        resource.setDescription(request.getDescription().trim());
        resource.setCategory(request.getCategory().trim());
        resource.setType(request.getType().trim().toLowerCase());
        resource.setContentUrl(request.getContentUrl().trim());
        resource.setIsPublished(request.getIsPublished() == null || request.getIsPublished());
    }

    public void sendAnnouncementToStudents(Long adminUserId, AnnouncementRequest request) {
        User adminUser = validateAdmin(adminUserId);

        String adminName = request.getName() == null || request.getName().trim().isEmpty()
                ? adminUser.getName()
                : request.getName().trim();
        String topic = request.getUpdateAbout().trim();
        String conciergeDetails = request.getConciergeDetails().trim();
        String message = request.getMessage() == null ? "" : request.getMessage().trim();

        StringBuilder finalMessage = new StringBuilder();
        finalMessage.append("New update by admin ")
                .append(adminName)
                .append(": Topic - ")
                .append(topic)
                .append(". Concierge - ")
                .append(conciergeDetails);

        if (!message.isBlank()) {
            finalMessage.append(". Details - ").append(message);
        }

        notificationService.notifyAllStudents(finalMessage.toString());
    }

}
