package com.fptu.ojt.controllers;

import com.fptu.ojt.common.exceptions.CrudException;
import com.fptu.ojt.common.payload.ApplicationResponse;
import com.fptu.ojt.common.payload.OjtResultResponse;
import com.fptu.ojt.common.payload.dto.ApplicationDTO;
import com.fptu.ojt.common.payload.dto.JobDTO;
import com.fptu.ojt.common.payload.request.VerifyApplicationRequest;
import com.fptu.ojt.configuration.security.services.UserDetailsImpl;
import com.fptu.ojt.mappers.ApplicationMapper;
import com.fptu.ojt.services.StudentService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/student")
@SecurityRequirement(name = "bearerAuth")
public class StudentController {
    private final StudentService studentService;
    private final ApplicationMapper applicationMapper;

    public StudentController(StudentService studentService, ApplicationMapper applicationMapper) {
        this.studentService = studentService;
        this.applicationMapper = applicationMapper;
    }

    @PreAuthorize("hasAnyAuthority('STUDENT')")
    @GetMapping("/get-jobs-by-account-id")
    public List<JobDTO> getJobByAccountID(Authentication authentication) throws CrudException {
        Long accountId =((UserDetailsImpl) authentication.getPrincipal()).getId();
        return studentService.getListJobByAccountId(accountId);
    }

    @PreAuthorize("hasAnyAuthority('STUDENT')")
    @GetMapping("/get-jobs-by-account-id-and-company-id/{companyId}")
    public List<JobDTO> getJobByAccountIdAndCompanyId(@PathVariable Long companyId, Authentication authentication) throws CrudException {
        Long accountId =((UserDetailsImpl) authentication.getPrincipal()).getId();
        return studentService.getListJobByAccountIdAndCompanyId(accountId,companyId);
    }

    @PreAuthorize("hasAnyAuthority('STUDENT')")
    @PutMapping("/verify-application/{id}")
    public ApplicationDTO verifyApplication(@PathVariable Long id, @Valid @RequestBody VerifyApplicationRequest verifyApplicationRequest,
                                            Authentication authentication) throws CrudException {
        Long accountId = ((UserDetailsImpl) authentication.getPrincipal()).getId();
        return applicationMapper.applicationToApplicationDTO(studentService.verifyApplication(id,verifyApplicationRequest,accountId));
    }

    @PreAuthorize("hasAnyAuthority('STUDENT')")
    @GetMapping("/get-list-application")
    public List<ApplicationResponse> getAllApplication(Authentication authentication) throws CrudException {
        Long accountId = ((UserDetailsImpl) authentication.getPrincipal()).getId();
        return studentService.getAllApplication(accountId);
    }

    @PreAuthorize("hasAnyAuthority('STUDENT')")
    @GetMapping("/get-all-ojt-result")
    public List<OjtResultResponse> getAllOjtResult(Authentication authentication) throws CrudException {
        Long accountId = ((UserDetailsImpl) authentication.getPrincipal()).getId();
        return studentService.getAllOjtResult(accountId);
    }





}
