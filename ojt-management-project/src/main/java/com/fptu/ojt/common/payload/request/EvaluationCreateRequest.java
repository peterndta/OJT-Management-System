package com.fptu.ojt.common.payload.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotNull;
import java.io.Serializable;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EvaluationCreateRequest extends EvaluationUpdateRequest implements Serializable {
    @NotNull
    private Long applicationId;
}
