package com.fptu.ojt.common.payload.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SemesterDTO implements Serializable {
    private Long id;
    private String name;
    private Date startDate;
    private Date endDate;
}
