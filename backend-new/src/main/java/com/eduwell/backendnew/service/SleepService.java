package com.eduwell.backendnew.service;

import com.eduwell.backendnew.dto.SleepEntryRequest;
import com.eduwell.backendnew.dto.SleepEntryResponse;
import com.eduwell.backendnew.entity.SleepEntry;
import com.eduwell.backendnew.repository.SleepRepository;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;

@Service
public class SleepService {

    private final SleepRepository sleepRepository;
    private final SubmissionEmailService submissionEmailService;

    public SleepService(SleepRepository sleepRepository,
                        SubmissionEmailService submissionEmailService) {
        this.sleepRepository = sleepRepository;
        this.submissionEmailService = submissionEmailService;
    }

    public SleepEntryResponse createEntry(Long userId, SleepEntryRequest request) {
        SleepEntry entry = new SleepEntry(userId, request.getHoursSlept(), request.getQuality());
        SleepEntry saved = sleepRepository.save(entry);
        submissionEmailService.sendSubmissionSuccessEmail(userId, "Sleep Tracker");
        return new SleepEntryResponse(saved.getId(), saved.getUserId(), saved.getHoursSlept(), 
                                     saved.getQuality(), saved.getCreatedAt());
    }

    public List<SleepEntryResponse> getEntries(Long userId) {
        return sleepRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(e -> new SleepEntryResponse(e.getId(), e.getUserId(), e.getHoursSlept(), 
                                                  e.getQuality(), e.getCreatedAt()))
                .collect(Collectors.toList());
    }

    public void deleteEntry(Long userId, Long entryId) {
        SleepEntry entry = sleepRepository.findById(entryId)
                .orElseThrow(() -> new RuntimeException("Sleep entry not found"));
        
        if (!entry.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized to delete this entry");
        }
        
        sleepRepository.deleteById(entryId);
    }
}
