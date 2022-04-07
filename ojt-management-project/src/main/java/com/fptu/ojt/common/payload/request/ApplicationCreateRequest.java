package com.fptu.ojt.common.payload.request;

import com.fptu.ojt.common.payload.dto.AttachmentDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.io.Serializable;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ApplicationCreateRequest implements Serializable {
    @NotNull
    @NotBlank
    @Size(max = 1000)
    private String experience;

    @NotNull
    private Long jobId;

    private List<AttachmentDTO> attachments;

    //Contructor for company offer student
    public ApplicationCreateRequest(Long jobId) {
        this.jobId = jobId;
    }
}
