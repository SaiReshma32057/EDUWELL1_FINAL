package com.eduwell.backendnew.dto;

import java.time.LocalDateTime;
public class JournalEntryResponse {

    private Long id;
    private Long userId;
    private String mood;
    private String feelings;
    private String thoughts;
    private LocalDateTime createdAt;

    public JournalEntryResponse() {
    }

    public JournalEntryResponse(Long id, Long userId, String mood, String feelings, String thoughts, LocalDateTime createdAt) {
        this.id = id;
        this.userId = userId;
        this.mood = mood;
        this.feelings = feelings;
        this.thoughts = thoughts;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getMood() {
        return mood;
    }

    public void setMood(String mood) {
        this.mood = mood;
    }

    public String getFeelings() {
        return feelings;
    }

    public void setFeelings(String feelings) {
        this.feelings = feelings;
    }

    public String getThoughts() {
        return thoughts;
    }

    public void setThoughts(String thoughts) {
        this.thoughts = thoughts;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
