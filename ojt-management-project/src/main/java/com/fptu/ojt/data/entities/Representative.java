package com.fptu.ojt.data.entities;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToOne;
import javax.persistence.Table;
import java.io.Serializable;

@Entity
@Table(name = "representative")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Representative implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    //----------[Start]Mapping relationship----------
    @OneToOne
    private Company company;

    @OneToOne
    private Account account;
    //----------[End]Mapping relationship----------

}
