package com.fptu.ojt.common.payload;

import com.fptu.ojt.common.payload.dto.AttachmentDTO;
import com.fptu.ojt.data.entities.Attachment;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ApplicationResponse {
    private Long id;
    private String email;
    private String studentName;
    private String studentCode;
    private String majorName;
    private String jobName;
    private String companyName;
    private double gpa;
    private String experience;
    private boolean isStudentConfirmed;
    private boolean isCompanyAccepted;
    private AttachmentDTO cv;
}
