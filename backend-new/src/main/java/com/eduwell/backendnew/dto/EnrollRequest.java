package com.eduwell.backendnew.dto;

import jakarta.validation.constraints.NotNull;
public class EnrollRequest {

    @NotNull(message = "Program ID is required")
    private Long programId;

    public EnrollRequest() {
    }

    public Long getProgramId() {
        return programId;
    }

    public void setProgramId(Long programId) {
        this.programId = programId;
    }
}
