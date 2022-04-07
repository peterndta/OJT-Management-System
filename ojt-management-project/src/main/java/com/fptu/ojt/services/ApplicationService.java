package com.fptu.ojt.services;
import com.fptu.ojt.common.exceptions.*;
import com.fptu.ojt.common.payload.request.ApplicationCreateRequest;
import com.fptu.ojt.common.payload.request.ApplicationUpdateRequest;
import com.fptu.ojt.data.entities.Application;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

import javax.mail.MessagingException;

public interface ApplicationService {

    Application getAppById(Long id, Long accountId) throws ApplicationNotExistedException, AccountIdNotExistedException;

    Page<Application> searchApplication(Specification<Application> specification, Pageable pageable);

    Application updateApplication(Long id, ApplicationUpdateRequest applicationUpdateRequest, Long accountId)
            throws ApplicationNotExistedException, NotPermissionException, ApplicationDenied;

    boolean deleteApplication(Long id, Long accountId) throws ApplicationNotExistedException, NotPermissionException;

    Application createApplication(ApplicationCreateRequest applicationCreateRequest, Long accountId) throws MessagingException, CrudException;
}
