package com.eduwell.backendnew.service;

import com.eduwell.backendnew.dto.JournalEntryRequest;
import com.eduwell.backendnew.dto.JournalEntryResponse;
import com.eduwell.backendnew.entity.JournalEntry;
import com.eduwell.backendnew.repository.JournalRepository;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class JournalService {

    private final JournalRepository journalRepository;
    private final SubmissionEmailService submissionEmailService;

    public JournalService(JournalRepository journalRepository,
                          SubmissionEmailService submissionEmailService) {
        this.journalRepository = journalRepository;
        this.submissionEmailService = submissionEmailService;
    }

    public JournalEntryResponse createEntry(Long userId, JournalEntryRequest request) {
        JournalEntry entry = new JournalEntry(null, userId, request.getMood().trim(), request.getFeelings().trim(), request.getThoughts().trim(), LocalDateTime.now());
        JournalEntry saved = journalRepository.save(entry);
        submissionEmailService.sendSubmissionSuccessEmail(userId, "Reflect Now");

        return toResponse(saved);
    }

    public List<JournalEntryResponse> getEntries(Long userId) {
        return journalRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(this::toResponse)
                .toList();
    }

    public void deleteEntry(Long userId, Long entryId) {
        JournalEntry entry = journalRepository.findById(entryId)
                .orElseThrow(() -> new IllegalArgumentException("Journal entry not found"));

        if (!entry.getUserId().equals(userId)) {
            throw new IllegalArgumentException("Unauthorized access");
        }

        journalRepository.deleteById(entryId);
    }

    private JournalEntryResponse toResponse(JournalEntry entry) {
        return new JournalEntryResponse(entry.getId(), entry.getUserId(), entry.getMood(), entry.getFeelings(), entry.getThoughts(), entry.getCreatedAt());
    }
}
