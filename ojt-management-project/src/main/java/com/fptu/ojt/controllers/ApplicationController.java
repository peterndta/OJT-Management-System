package com.fptu.ojt.controllers;

import com.fptu.ojt.common.exceptions.CrudException;
import com.fptu.ojt.common.payload.dto.ApplicationDTO;
import com.fptu.ojt.common.payload.request.ApplicationCreateRequest;
import com.fptu.ojt.common.payload.request.ApplicationUpdateRequest;
import com.fptu.ojt.configuration.security.services.UserDetailsImpl;
import com.fptu.ojt.mappers.ApplicationMapper;
import com.fptu.ojt.services.ApplicationService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import javax.mail.MessagingException;
import javax.validation.Valid;

@RestController
@RequestMapping("/applications")
@SecurityRequirement(name = "bearerAuth")
public class ApplicationController {

    private final ApplicationMapper applicationMapper;
    private final ApplicationService applicationService;

    public ApplicationController(ApplicationMapper applicationMapper, ApplicationService applicationService) {
        this.applicationMapper = applicationMapper;
        this.applicationService = applicationService;
    }


    @PreAuthorize("hasAnyAuthority('STUDENT')")
    @PostMapping("/apply-for-a-position")
    public ApplicationDTO createApplication(@Valid @RequestBody ApplicationCreateRequest applicationCreateRequest,
                                            Authentication authentication)
            throws CrudException, MessagingException {
        Long accountId = ((UserDetailsImpl) authentication.getPrincipal()).getId();
        return applicationMapper.applicationToApplicationDTO(applicationService.
                createApplication(applicationCreateRequest, accountId));
    }

    @PreAuthorize("hasAnyAuthority( 'STUDENT')")
    @PutMapping("update-application/{id}")
    public ApplicationDTO updateApplication(@PathVariable Long id,
                                            @Valid @RequestBody ApplicationUpdateRequest applicationUpdateRequest,
                                            Authentication authentication)
            throws CrudException {
        Long accountId = ((UserDetailsImpl) authentication.getPrincipal()).getId();
        return applicationMapper.applicationToApplicationDTO(applicationService.
                updateApplication(id, applicationUpdateRequest, accountId));
    }


}
