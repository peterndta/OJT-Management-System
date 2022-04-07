package com.fptu.ojt.common.payload.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.io.Serializable;
import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SemesterRequest implements Serializable {
    @NotNull
    @NotBlank
    @Size(max = 255)
    private String name;

    @NotNull
    private Date startDate;

    @NotNull
    private Date endDate;
}
