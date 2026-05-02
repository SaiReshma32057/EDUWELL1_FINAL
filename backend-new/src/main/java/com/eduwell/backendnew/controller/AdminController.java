package com.eduwell.backendnew.controller;

import com.eduwell.backendnew.dto.AnnouncementRequest;
import com.eduwell.backendnew.dto.ProgramUpsertRequest;
import com.eduwell.backendnew.dto.ResourceUpsertRequest;
import com.eduwell.backendnew.entity.Program;
import com.eduwell.backendnew.entity.ResourceItem;
import com.eduwell.backendnew.service.ProgramService;
import com.eduwell.backendnew.service.ResourceService;
import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final ResourceService resourceService;
    private final ProgramService programService;

    public AdminController(ResourceService resourceService, ProgramService programService) {
        this.resourceService = resourceService;
        this.programService = programService;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> dashboard(@RequestHeader("x-user-id") Long userId) {
        return ResponseEntity.ok(resourceService.getAdminDashboardSummary(userId));
    }

    @GetMapping("/resources")
    public ResponseEntity<List<ResourceItem>> resources(@RequestHeader("x-user-id") Long userId) {
        return ResponseEntity.ok(resourceService.getAdminResources(userId));
    }

    @GetMapping("/users")
    public ResponseEntity<Map<String, Object>> users(@RequestHeader("x-user-id") Long userId) {
        return ResponseEntity.ok(resourceService.getAdminUsersSummary(userId));
    }

    @PostMapping("/resources")
    public ResponseEntity<ResourceItem> createResource(@RequestHeader("x-user-id") Long userId,
                                                       @Valid @RequestBody ResourceUpsertRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(resourceService.createResource(userId, request));
    }

    @PutMapping("/resources/{resourceId}")
    public ResponseEntity<ResourceItem> updateResource(@RequestHeader("x-user-id") Long userId,
                                                       @PathVariable Long resourceId,
                                                       @Valid @RequestBody ResourceUpsertRequest request) {
        return ResponseEntity.ok(resourceService.updateResource(userId, resourceId, request));
    }

    @DeleteMapping("/resources/{resourceId}")
    public ResponseEntity<Map<String, String>> deleteResource(@RequestHeader("x-user-id") Long userId,
                                                              @PathVariable Long resourceId) {
        resourceService.deleteResource(userId, resourceId);
        return ResponseEntity.ok(Map.of("status", "success", "message", "Resource deleted successfully"));
    }

    @GetMapping("/sessions")
    public ResponseEntity<List<Program>> sessions(@RequestHeader("x-user-id") Long userId) {
        return ResponseEntity.ok(programService.getAdminPrograms(userId));
    }

    @PostMapping("/sessions")
    public ResponseEntity<Program> createSession(@RequestHeader("x-user-id") Long userId,
                                                 @Valid @RequestBody ProgramUpsertRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(programService.createProgram(userId, request));
    }

    @PutMapping("/sessions/{sessionId}")
    public ResponseEntity<Program> updateSession(@RequestHeader("x-user-id") Long userId,
                                                 @PathVariable Long sessionId,
                                                 @Valid @RequestBody ProgramUpsertRequest request) {
        return ResponseEntity.ok(programService.updateProgram(userId, sessionId, request));
    }

    @DeleteMapping("/sessions/{sessionId}")
    public ResponseEntity<Map<String, String>> deleteSession(@RequestHeader("x-user-id") Long userId,
                                                             @PathVariable Long sessionId) {
        programService.deleteProgram(userId, sessionId);
        return ResponseEntity.ok(Map.of("status", "success", "message", "Session deleted successfully"));
    }

    @PostMapping("/announcements")
    public ResponseEntity<Map<String, String>> announce(@RequestHeader("x-user-id") Long userId,
                                                        @Valid @RequestBody AnnouncementRequest request) {
        programService.getAdminPrograms(userId);
        resourceService.sendAnnouncementToStudents(userId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("status", "success", "message", "Announcement sent successfully"));
    }
}
