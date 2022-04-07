package com.fptu.ojt.common.payload.dto;

import com.fptu.ojt.data.entities.Major;
import com.fptu.ojt.data.entities.Semester;
import lombok.Data;

@Data
public class StudentImportDTO {
    private String name;
    private String phone;
    private String avatar;
    private String email;
    private String password;
    private String studentCode;
    private String address;
    private Semester semester;
    private Major major;
    private String gpa;
}
