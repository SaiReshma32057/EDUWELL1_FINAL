package com.eduwell.backendnew.controller;

import com.eduwell.backendnew.dto.ApiResponse;
import com.eduwell.backendnew.dto.SleepEntryRequest;
import com.eduwell.backendnew.dto.SleepEntryResponse;
import com.eduwell.backendnew.service.SleepService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/sleep")
public class SleepController {

    private final SleepService sleepService;

    public SleepController(SleepService sleepService) {
        this.sleepService = sleepService;
    }

    @PostMapping("/entries")
    public ResponseEntity<ApiResponse> createEntry(@RequestHeader("X-User-Id") Long userId,
                                                   @Valid @RequestBody SleepEntryRequest request) {
        SleepEntryResponse data = sleepService.createEntry(userId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(new ApiResponse("success", "Sleep entry saved successfully", data));
    }

    @GetMapping("/entries")
    public ResponseEntity<ApiResponse> getEntries(@RequestHeader("X-User-Id") Long userId) {
        List<SleepEntryResponse> data = sleepService.getEntries(userId);
        return ResponseEntity.ok(new ApiResponse("success", "Sleep entries retrieved successfully", data));
    }

    @DeleteMapping("/entries/{entryId}")
    public ResponseEntity<ApiResponse> deleteEntry(@RequestHeader("X-User-Id") Long userId,
                                                   @PathVariable Long entryId) {
        sleepService.deleteEntry(userId, entryId);
        return ResponseEntity.ok(new ApiResponse("success", "Sleep entry deleted successfully", null));
    }
}
