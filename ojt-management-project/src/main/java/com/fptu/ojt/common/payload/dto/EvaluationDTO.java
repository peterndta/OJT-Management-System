package com.fptu.ojt.common.payload.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EvaluationDTO implements Serializable {
    private Long id;
    private String comment;
    private Long grade;
    private boolean isPass;
    private ApplicationDTO application;
}
