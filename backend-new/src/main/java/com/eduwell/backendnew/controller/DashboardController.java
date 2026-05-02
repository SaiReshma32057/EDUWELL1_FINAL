package com.eduwell.backendnew.controller;

import com.eduwell.backendnew.dto.AppointmentRequest;
import com.eduwell.backendnew.dto.EnrollRequest;
import com.eduwell.backendnew.entity.Appointment;
import com.eduwell.backendnew.entity.Program;
import com.eduwell.backendnew.entity.ResourceItem;
import com.eduwell.backendnew.service.AppointmentService;
import com.eduwell.backendnew.service.ProgramService;
import com.eduwell.backendnew.service.ResourceService;
import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class DashboardController {

    private final ProgramService programService;
    private final AppointmentService appointmentService;
    private final ResourceService resourceService;

    public DashboardController(ProgramService programService, AppointmentService appointmentService, ResourceService resourceService) {
        this.programService = programService;
        this.appointmentService = appointmentService;
        this.resourceService = resourceService;
    }

    @PostMapping("/enroll")
    public ResponseEntity<Map<String, String>> enroll(@RequestHeader("x-user-id") Long userId,
                                                      @Valid @RequestBody EnrollRequest request) {
        programService.enroll(userId, request);
        return ResponseEntity.ok(Map.of("status", "success", "message", "Enrolled successfully"));
    }

    @GetMapping("/my-programs")
    public ResponseEntity<List<Map<String, Object>>> myPrograms(@RequestHeader("x-user-id") Long userId) {
        return ResponseEntity.ok(programService.getMyPrograms(userId));
    }

    @GetMapping("/programs")
    public ResponseEntity<List<Program>> programs() {
        return ResponseEntity.ok(programService.getPrograms());
    }

    @GetMapping("/appointments")
    public ResponseEntity<List<Appointment>> appointments(@RequestHeader("x-user-id") Long userId) {
        return ResponseEntity.ok(appointmentService.getAppointments(userId));
    }

    @PostMapping("/appointments")
    public ResponseEntity<Appointment> bookAppointment(@RequestHeader("x-user-id") Long userId,
                                                       @Valid @RequestBody AppointmentRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(appointmentService.createAppointment(userId, request));
    }

    @GetMapping("/resources")
    public ResponseEntity<List<ResourceItem>> resources() {
        return ResponseEntity.ok(resourceService.getResources());
    }

    @GetMapping("/resources/new-features")
    public ResponseEntity<List<ResourceItem>> newFeatures() {
        return ResponseEntity.ok(resourceService.getRecentNewFeatures());
    }

    @PostMapping("/resources/{resourceId}/view")
    public ResponseEntity<Map<String, String>> trackResourceView(@RequestHeader("x-user-id") Long userId,
                                                                 @PathVariable Long resourceId) {
        resourceService.trackResourceUsage(resourceId);
        return ResponseEntity.ok(Map.of("status", "success", "message", "Resource usage tracked"));
    }
}
