package com.fptu.ojt.data.repositories;

import com.fptu.ojt.data.entities.Application;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long>, JpaSpecificationExecutor<Application> {
    @Query("SELECT a " +
            "FROM Application a " +
            "WHERE a.job.company.id = :companyId " +
            "AND a.id = :id")
    Application getAppRep(@Param("id") Long id, @Param("companyId") Long companyId);

    @Query("SELECT a " +
            "FROM Application a " +
            "WHERE a.student.id = :studentId " +
            "AND a.id = :id")
    Application getAppStudent(@Param("id") Long id, @Param("studentId") Long studentId);

    @Query("SELECT a FROM Application a WHERE a.disabled = false")
    List<Application> getAllApplicationForAdmin();

    @Query("SELECT a FROM Application a WHERE a.disabled = false AND a.student.id = :studentId ")
    List<Application> getAllApplicationByStudentId(@Param("studentId")Long studentId);

    @Query("SELECT a FROM Application a WHERE a.disabled = false AND a.job.company.id = :companyId ")
    List<Application> getApplicationByCompanyId(@Param("companyId")Long companyId);

    @Query("Select a " +
            "From Application a " +
            "where a.job.id = :jobId " +
            "And a.student.id = :studentId " +
            "And a.isStudentConfirmed = true")
    Application getApplicationByJobAndStudentAndIsStudentConfirmed(@Param("jobId") Long jobId, @Param("studentId") Long studentId);

    boolean existsByJobIdAndStudentId(Long jobId, Long studentId);
}
