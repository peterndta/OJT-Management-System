package com.fptu.ojt.data.repositories;
import com.fptu.ojt.data.entities.Evaluation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EvaluationRepository extends JpaRepository<Evaluation, Long>, JpaSpecificationExecutor<Evaluation> {
    @Query("SELECT e " +
            "FROM Evaluation e " +
            "WHERE e.application.student.id = :studentId " +
            "AND e.id = :id")
    Evaluation getEvaluationStudent(@Param("studentId") Long studentId, @Param("id") Long id);

    @Query("SELECT e " +
            "FROM Evaluation e " +
            "WHERE e.application.job.company.id = :companyId " +
            "AND e.id = :id")
    Evaluation getEvaluationRep(@Param("companyId") Long companyId, @Param("id") Long id);

    List<Evaluation> findAll();

    @Query("SELECT e " +
            "FROM Evaluation e " +
            "WHERE e.application.student.id = :studentId")
    List<Evaluation> getAllByStudentId(Long studentId);
}
