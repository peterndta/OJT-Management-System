package com.fptu.ojt.common.payload.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.sql.Timestamp;
import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ApplicationDTO implements Serializable {
    private Long id;
    private String experience;
    private boolean isCompanyAccepted;
    private Timestamp acceptedAt;
    private boolean isStudentConfirmed;
    private Timestamp confirmedAt;
    private boolean isSchoolDenied;
    private StudentDTO student;
    private JobDTO job;
    private Set<AttachmentDTO> attachments;
    private ApplicationStudentAccountDTO account;
}
