package com.fptu.ojt.common.payload.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.sql.Timestamp;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MajorDTO implements Serializable {
    private Long id;
    private String name;
    private Timestamp createdAt;
    private Timestamp updatedAt;
    private boolean disabled;
}
