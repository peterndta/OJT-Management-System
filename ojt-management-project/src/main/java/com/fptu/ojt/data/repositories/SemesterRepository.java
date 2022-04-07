package com.fptu.ojt.data.repositories;

import com.fptu.ojt.data.entities.Semester;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface SemesterRepository extends JpaRepository<Semester, Long>, JpaSpecificationExecutor<Semester> {

    boolean existsByName(String name);

    boolean existsByStartDateAndEndDate(Date startDate, Date endDate);

    boolean existsById(Long id);

    List<Semester> findAllByIdIn(List<Long> ids);

    Semester getByName(String name);

    Semester findFirstByOrderByStartDateDesc();

    @Query("Select s from Semester s where :currentDate > s.startDate and :currentDate < s.endDate order by s.startDate desc")
    List<Semester> getCurrentSemester(@Param("currentDate") Date currentDate);


}
