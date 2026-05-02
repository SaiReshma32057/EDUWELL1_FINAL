package com.eduwell.backendnew.dto;

import jakarta.validation.constraints.NotBlank;

public class AnnouncementRequest {

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Update topic is required")
    private String updateAbout;

    @NotBlank(message = "Concierge details are required")
    private String conciergeDetails;

    private String message;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getUpdateAbout() {
        return updateAbout;
    }

    public void setUpdateAbout(String updateAbout) {
        this.updateAbout = updateAbout;
    }

    public String getConciergeDetails() {
        return conciergeDetails;
    }

    public void setConciergeDetails(String conciergeDetails) {
        this.conciergeDetails = conciergeDetails;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
