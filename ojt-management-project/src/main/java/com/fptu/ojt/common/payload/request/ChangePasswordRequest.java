package com.fptu.ojt.common.payload.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
@Data
@NoArgsConstructor
public class ChangePasswordRequest {

    @NotNull
    @Size(min = 5, max = 1024)
    private String oldPassword;

    @NotNull
    @Size(min = 5, max = 1024)
    private String newPassword;
}
