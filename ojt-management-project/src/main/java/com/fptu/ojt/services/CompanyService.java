package com.fptu.ojt.services;

import com.fptu.ojt.common.exceptions.CrudException;
import com.fptu.ojt.common.payload.ApplicationResponse;
import com.fptu.ojt.common.payload.JobResponse;
import com.fptu.ojt.common.payload.dto.JobDTO;
import com.fptu.ojt.common.payload.dto.UserDTO;
import com.fptu.ojt.common.payload.request.ApplicationCreateRequest;
import com.fptu.ojt.common.payload.request.CompanyRequest;
import com.fptu.ojt.common.payload.request.ConfirmApplicationRequest;
import com.fptu.ojt.data.entities.Application;
import com.fptu.ojt.data.entities.Company;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;


import javax.mail.MessagingException;
import java.util.List;
import java.util.Set;


public interface CompanyService {
    Page<Company> searchCompany(Specification<Company> specification, Pageable pageable);

    Company updateCompany(Long id, CompanyRequest companyRequest, Long accountId) throws CrudException;

    Company getCompanyById(Long id, Long accountId) throws CrudException;

    List<UserDTO> getStudentListById(Long accountId) throws CrudException;

    UserDTO getStudentInfo(Long id) throws CrudException;

    List<JobDTO> getListJobById(Long id) throws CrudException;

    Application confirmApplication(Long id, ConfirmApplicationRequest confirmApplicationRequest, Long accountId) throws CrudException;

    Application offerStudent(ApplicationCreateRequest applicationCreateRequest, Long accountId, Long studentId) throws CrudException, MessagingException;

    List<ApplicationResponse> getAllApplication(Long accountId) throws CrudException;

    List<JobResponse> getJobsForStudent(Long studentId, Long accountId) throws CrudException;

}
