package com.fptu.ojt.services;


import com.fptu.ojt.common.exceptions.CrudException;
import com.fptu.ojt.common.exceptions.NotPermissionException;
import com.fptu.ojt.common.exceptions.StudentNotFoundException;
import com.fptu.ojt.common.payload.ApplicationResponse;
import com.fptu.ojt.common.payload.OjtResultResponse;
import com.fptu.ojt.common.payload.dto.ApplicationDTO;
import com.fptu.ojt.common.payload.dto.EvaluationDTO;
import com.fptu.ojt.common.payload.dto.JobDTO;
import com.fptu.ojt.common.payload.dto.UserDTO;
import com.fptu.ojt.data.entities.Student;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;

import java.util.List;

public interface AdminService {
    List<UserDTO> getAllStudentList(Long accountId) throws CrudException;

    int importStudentList(MultipartFile file) throws CrudException;

    ByteArrayInputStream exportStudentList(Specification<Student> specification) throws StudentNotFoundException;

    List<ApplicationResponse> getAllApplication(Long accountId) throws NotPermissionException;

    List<OjtResultResponse> getAllEvaluation(Long accountId) throws NotPermissionException;

    List<JobDTO> getJobsByCompanyId(Long accountId,Long companyId) throws NotPermissionException;
}
