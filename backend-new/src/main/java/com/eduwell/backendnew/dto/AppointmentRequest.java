package com.eduwell.backendnew.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
public class AppointmentRequest {

    @JsonProperty("counselorName")
    @NotBlank(message = "Counselor name is required")
    private String counselorName;

    @NotBlank(message = "Date is required")
    private String date;

    @NotBlank(message = "Type is required")
    private String type;

    public AppointmentRequest() {
    }

    public String getCounselorName() {
        return counselorName;
    }

    public void setCounselorName(String counselorName) {
        this.counselorName = counselorName;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }
}
