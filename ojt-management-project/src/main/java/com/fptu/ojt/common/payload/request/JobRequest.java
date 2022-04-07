package com.fptu.ojt.common.payload.request;

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
public class JobRequest implements Serializable {
    @NotNull
    @NotBlank
    @Size(max = 255)
    private String name;

    @NotNull
    @NotBlank
    @Size(max = 255)
    private String title;

    @NotNull
    @NotBlank
    @Size(max = 255)
    private String salary;

    @Size(max = 1000)
    private List<String> topReasons;

    @Size(max = 2000)
    private String description;

    @Size(max = 1000)
    private List<String> descriptionItems;

    @Size(max = 2000)
    private String aboutOurTeam;

    @Size(max = 1000)
    private List<String> responsibilities;

    @Size(max = 1000)
    private List<String> mustHaveSkills;

    @Size(max = 1000)
    private List<String> niceToHaveSkills;

    @Size(max = 2000)
    private String whyYouWillLove;

    @Size(max = 1000)
    private List<String> benefits;

    @NotNull
    private List<Long> semesterIds;

    @NotNull
    private List<Long> majorIds;
}
