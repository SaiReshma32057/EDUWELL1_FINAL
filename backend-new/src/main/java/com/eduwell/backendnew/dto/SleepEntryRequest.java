package com.eduwell.backendnew.dto;

import jakarta.validation.constraints.NotNull;

public class SleepEntryRequest {

    @NotNull(message = "Hours slept is required")
    private Double hoursSlept;

    private String quality;

    public SleepEntryRequest() {
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
}
