package com.fptu.ojt.common.payload;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OjtResultResponse {
    private Long id;
    private String companyName;
    private String studentCode;
    private String studentName;
    private String majorName;
    private String jobName;
    private Long grade;
    private boolean isPass;
    private String comment;
}
