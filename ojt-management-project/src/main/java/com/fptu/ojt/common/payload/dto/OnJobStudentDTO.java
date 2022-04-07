package com.fptu.ojt.common.payload.dto;

import lombok.Data;

@Data
public class OnJobStudentDTO {
    private String studentCode;
    private String email;
    private String jobName;
    private String companyName;
    private String comment;
    private String grade;
    private String isPassed;
}
