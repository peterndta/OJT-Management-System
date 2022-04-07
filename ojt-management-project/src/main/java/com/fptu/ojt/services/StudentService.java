package com.fptu.ojt.services;

import com.fptu.ojt.common.exceptions.CompanyNotExistedException;
import com.fptu.ojt.common.exceptions.CrudException;
import com.fptu.ojt.common.exceptions.NotPermissionException;
import com.fptu.ojt.common.payload.ApplicationResponse;
import com.fptu.ojt.common.payload.OjtResultResponse;
import com.fptu.ojt.common.payload.dto.JobDTO;
import com.fptu.ojt.common.payload.dto.StudentDTO;
import com.fptu.ojt.common.payload.dto.UserDTO;
import com.fptu.ojt.common.payload.request.VerifyApplicationRequest;
import com.fptu.ojt.data.entities.Account;
import com.fptu.ojt.data.entities.Application;
import com.fptu.ojt.data.entities.Student;

import java.util.List;

public interface StudentService {
    List<JobDTO> getListJobByAccountId(Long id) throws NotPermissionException;
    List<JobDTO> getListJobByAccountIdAndCompanyId(Long accountId, Long companyId) throws NotPermissionException, CompanyNotExistedException;
    Application verifyApplication (Long id, VerifyApplicationRequest verifyApplicationRequest, Long accountId) throws CrudException;
    List<ApplicationResponse> getAllApplication(Long accountId) throws CrudException;
    List<OjtResultResponse> getAllOjtResult(Long accountId) throws CrudException;
    UserDTO studentToUserDto(Student student);
}
