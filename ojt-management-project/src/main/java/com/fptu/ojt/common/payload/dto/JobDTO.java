package com.fptu.ojt.common.payload.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.List;
import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class JobDTO implements Serializable {
    private Long id;
    private String name;
    private String title;
    private String salary;
    private List<String> topReasons;
    private String description;
    private String aboutOurTeam;
    private List<String> responsibilities;
    private List<String> mustHaveSkills;
    private List<String> niceToHaveSkills;
    private String whyYouWillLove;
    private List<String> benefits;
    private Set<SemesterDTO> semesters;
    private Set<MajorDTO> majors;
    private CompanyDTO company;
}
