package com.fptu.ojt.data.repositories;

import com.fptu.ojt.data.entities.Company;
import com.fptu.ojt.data.entities.Job;
import com.fptu.ojt.data.entities.Major;
import com.fptu.ojt.data.entities.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Set;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> , JpaSpecificationExecutor<Student> {

    List<Student> getStudentsByMajorInAndOjtStatus(List<Major> majorList, int ojtStatus);

    List<Student> findAll();

    Student getStudentById(Long studentId);
    Student getStudentByStudentCode(String studentCode);
    boolean existsById(Long studentId);




}
