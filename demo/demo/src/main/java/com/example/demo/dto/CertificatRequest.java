package com.example.demo.dto;


public class CertificatRequest {
    private Long userId;
    private Long formationId;

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public Long getFormationId() { return formationId; }
    public void setFormationId(Long formationId) { this.formationId = formationId; }
}
