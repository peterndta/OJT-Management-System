package com.fptu.ojt.data.repositories;

import com.fptu.ojt.data.entities.Company;
import com.fptu.ojt.data.entities.Job;
import com.fptu.ojt.data.entities.Major;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobRepository extends JpaRepository<Job, Long>, JpaSpecificationExecutor<Job> {
    //Get job by ID for Rep
    @Query("SELECT DISTINCT j " +
            "FROM Job j " +
            "INNER JOIN j.company c " +
            "WHERE c.id = :companyId " +
            "AND j.id = :id")
    Job getJobByRep(@Param("companyId") Long companyId, @Param("id") Long id);

    @Query("SELECT DISTINCT j.majors FROM Job j JOIN Company c ON j.company.id = :companyId")
    List<Major> getMajorsByCompanyID(@Param("companyId") Long companyId);

    @Query("SELECT DISTINCT j " +
            "FROM Job j " +
            "INNER JOIN j.company c " +
            "WHERE j.company.id = :companyId " +
            "AND j.disabled = false ")
    List<Job> getJobsByCompanyId(@Param("companyId") Long companyId);

    @Query("SELECT j FROM Job j JOIN j.semesters s ON s.id = :semesterId JOIN j.majors m ON m.id = :majorId WHERE j.disabled = false")
    List<Job> getAllByMajorIdAndSemesterId(@Param("majorId") Long majorId, @Param("semesterId") Long semesterId);

    @Query("SELECT j FROM Job j JOIN j.semesters s ON s.id = :semesterId JOIN j.majors m ON m.id = :majorId WHERE j.disabled = false AND j.company.id = :companyId")
    List<Job> getAllByMajorIdAndSemesterIdAndCompanyId(@Param("majorId") Long majorId, @Param("semesterId") Long semesterId, @Param("companyId") Long companyId);

    Boolean existsByCompanyId(Long companyId);

    List<Job> getJobByCompany(Company company);


}
