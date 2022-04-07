package com.fptu.ojt.common.payload.dto;

import com.fptu.ojt.data.entities.Account;
import lombok.*;

import java.io.Serializable;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class StudentDTO implements Serializable {
    private Long id;
    private String address;
    private String studentCode;
    private double gpa;
    private int ojtStatus;
    private MajorDTO major;
    private SemesterDTO semester;
}
