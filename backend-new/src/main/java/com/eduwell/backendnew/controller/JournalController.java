package com.eduwell.backendnew.controller;

import com.eduwell.backendnew.dto.ApiResponse;
import com.eduwell.backendnew.dto.JournalEntryRequest;
import com.eduwell.backendnew.dto.JournalEntryResponse;
import com.eduwell.backendnew.service.JournalService;
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
@RequestMapping("/api/journal")
public class JournalController {

    private final JournalService journalService;

    public JournalController(JournalService journalService) {
        this.journalService = journalService;
    }

    @PostMapping("/entries")
    public ResponseEntity<ApiResponse> createEntry(@RequestHeader("X-User-Id") Long userId,
                                                   @Valid @RequestBody JournalEntryRequest request) {
        JournalEntryResponse data = journalService.createEntry(userId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(new ApiResponse("success", "Journal entry saved successfully", data));
    }

    @GetMapping("/entries")
    public ResponseEntity<ApiResponse> getEntries(@RequestHeader("X-User-Id") Long userId) {
        List<JournalEntryResponse> data = journalService.getEntries(userId);
        return ResponseEntity.ok(new ApiResponse("success", "Journal entries retrieved successfully", data));
    }

    @DeleteMapping("/entries/{entryId}")
    public ResponseEntity<ApiResponse> deleteEntry(@RequestHeader("X-User-Id") Long userId,
                                                   @PathVariable Long entryId) {
        journalService.deleteEntry(userId, entryId);
        return ResponseEntity.ok(new ApiResponse("success", "Journal entry deleted successfully", null));
    }
}
