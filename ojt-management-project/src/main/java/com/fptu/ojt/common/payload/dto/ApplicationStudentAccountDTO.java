package com.fptu.ojt.common.payload.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ApplicationStudentAccountDTO implements Serializable {
    private StudentDTO student;
    private UserDTO user;
}
