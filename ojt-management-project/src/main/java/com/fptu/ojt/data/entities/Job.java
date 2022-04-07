package com.fptu.ojt.data.entities;

import com.vladmihalcea.hibernate.type.json.JsonType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Type;
import org.hibernate.annotations.TypeDef;
import org.hibernate.annotations.TypeDefs;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import java.io.Serializable;
import java.sql.Timestamp;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "job")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@EntityListeners(AuditingEntityListener.class)
@TypeDefs({
        @TypeDef(name = "json", typeClass = JsonType.class)
})
public class Job implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "salary", nullable = false)
    private String salary;

    @Type(type = "json")
    @Column(columnDefinition = "jsonb", name = "top_reasons", length = 1000)
    private List<String> topReasons;

    @Column(name = "description", length = 2000)
    private String description;

    @Type(type = "json")
    @Column(columnDefinition = "jsonb", name = "description_items", length = 1000)
    private List<String> descriptionItems;

    @Column(name = "about_our_team", length = 2000)
    private String aboutOurTeam;

    @Type(type = "json")
    @Column(columnDefinition = "jsonb", name = "responsibilities", length = 1000)
    private List<String> responsibilities;

    @Type(type = "json")
    @Column(columnDefinition = "jsonb", name = "must_have_skills", length = 1000)
    private List<String> mustHaveSkills;

    @Type(type = "json")
    @Column(columnDefinition = "jsonb", name = "nice_to_have_skills", length = 1000)
    private List<String> niceToHaveSkills;

    @Column(name = "why_you_will_love", length = 2000)
    private String whyYouWillLove;

    @Type(type = "json")
    @Column(columnDefinition = "jsonb", name = "benefits", length = 1000)
    private List<String> benefits;

    @CreatedDate
    @Column(name = "created_at", nullable = false)
    private Timestamp createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private Timestamp updatedAt;

    @Column(name = "is_disabled", columnDefinition = "BOOLEAN DEFAULT false")
    private boolean disabled;

    //----------[Start]Mapping relationship----------
    @ManyToOne
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;

    @ManyToMany
    @JoinTable(
            name = "job_major",
            joinColumns = @JoinColumn(name = "job_id"),
            inverseJoinColumns = @JoinColumn(name = "major_id"))
    private Set<Major> majors = new HashSet<>();

    @ManyToMany
    @JoinTable(
            name = "semester_job",
            joinColumns = @JoinColumn(name = "job_id"),
            inverseJoinColumns = @JoinColumn(name = "semester_id"))
    private Set<Semester> semesters = new HashSet<>();

    @OneToMany(mappedBy = "job")
    private Set<Application> applications = new HashSet<>();
    //----------[End]Mapping relationship----------


    public Job(String name, String title, String salary, List<String> topReasons, String description, List<String> descriptionItems, String aboutOurTeam, List<String> responsibilities, List<String> mustHaveSkills, List<String> niceToHaveSkills, String whyYouWillLove, List<String> benefits) {
        this.name = name;
        this.title = title;
        this.salary = salary;
        this.topReasons = topReasons;
        this.description = description;
        this.descriptionItems = descriptionItems;
        this.aboutOurTeam = aboutOurTeam;
        this.responsibilities = responsibilities;
        this.mustHaveSkills = mustHaveSkills;
        this.niceToHaveSkills = niceToHaveSkills;
        this.whyYouWillLove = whyYouWillLove;
        this.benefits = benefits;
    }

    public Job(Long id) {
        this.id = id;
    }
}
