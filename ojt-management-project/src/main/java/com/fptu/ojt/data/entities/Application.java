package com.fptu.ojt.data.entities;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import java.io.Serializable;
import java.sql.Timestamp;
import java.util.Set;

@Entity
@Table(name = "application")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@EntityListeners(AuditingEntityListener.class)

public class Application implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "experience", length = 1000)
    private String experience;

    @Column(name = "is_school_denied", columnDefinition = "BOOLEAN DEFAULT false")
    private boolean isSchoolDenied;

    @Column(name = "is_company_accepted", columnDefinition = "BOOLEAN DEFAULT false")
    private boolean isCompanyAccepted;

    @Column(name = "accepted_at")
    private Timestamp acceptedAt;

    @Column(name = "is_student_confirmed", columnDefinition = "BOOLEAN DEFAULT false")
    private boolean isStudentConfirmed;

    @Column(name = "confirmed_at")
    private Timestamp confirmedAt;

    @CreatedDate
    @Column(name = "created_at", nullable = false)
    private Timestamp createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private Timestamp updatedAt;

    @Column(name = "is_disabled", columnDefinition = "BOOLEAN DEFAULT false")
    private boolean disabled;

    //----------[Start]Mapping relationship----------
    @OneToMany(mappedBy = "application")
    private Set<Attachment> attachments;

    @OneToOne
    private Evaluation evaluation;

    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne
    @JoinColumn(name = "job_id", nullable = false)
    private Job job;
    //----------[End]Mapping relationship----------

    public Application(String experience, Set<Attachment> attachments) {
        this.experience = experience;
        this.attachments = attachments;
    }

}
