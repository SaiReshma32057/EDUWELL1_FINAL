package com.eduwell.backendnew.dto;

import java.time.LocalDateTime;

public class SleepEntryResponse {

    private Long id;
    private Long userId;
    private Double hoursSlept;
    private String quality;
    private LocalDateTime createdAt;

    public SleepEntryResponse(Long id, Long userId, Double hoursSlept, String quality, LocalDateTime createdAt) {
        this.id = id;
        this.userId = userId;
        this.hoursSlept = hoursSlept;
        this.quality = quality;
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

    public Double getHoursSlept() {
        return hoursSlept;
    }

    public void setHoursSlept(Double hoursSlept) {
        this.hoursSlept = hoursSlept;
    }

    public String getQuality() {
        return quality;
    }

    public void setQuality(String quality) {
        this.quality = quality;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
