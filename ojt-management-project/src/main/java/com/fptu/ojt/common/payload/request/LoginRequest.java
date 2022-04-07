package com.fptu.ojt.common.payload.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.io.Serializable;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LoginRequest implements Serializable {
    @Email(message = "Email is not valid")
    @NotBlank
    @Size(min = 6, max = 320)
    private String email;

    @NotBlank
    @Size(min = 6, max = 1024)
    @NotNull
    private String password;
}
