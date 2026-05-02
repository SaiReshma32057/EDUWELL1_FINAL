package com.eduwell.backendnew.dto;

import jakarta.validation.constraints.NotBlank;
public class JournalEntryRequest {

    @NotBlank(message = "Mood is required")
    private String mood;

    @NotBlank(message = "Feelings are required")
    private String feelings;

    @NotBlank(message = "Thoughts are required")
    private String thoughts;

    public JournalEntryRequest() {
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
}
