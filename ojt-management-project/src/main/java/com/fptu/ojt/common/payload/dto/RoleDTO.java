package com.fptu.ojt.common.payload.dto;

import com.fptu.ojt.common.enums.RoleEnum;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RoleDTO implements Serializable {
    private Integer id;
    private RoleEnum name;
}
