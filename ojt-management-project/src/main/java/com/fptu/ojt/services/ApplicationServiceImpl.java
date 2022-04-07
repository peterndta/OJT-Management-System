package com.fptu.ojt.services;

import com.fptu.ojt.common.exceptions.*;
import com.fptu.ojt.common.payload.dto.AttachmentDTO;
import com.fptu.ojt.common.payload.request.ApplicationCreateRequest;
import com.fptu.ojt.common.payload.request.ApplicationUpdateRequest;
import com.fptu.ojt.common.utils.EmailUtil;
import com.fptu.ojt.data.entities.Account;
import com.fptu.ojt.data.entities.Application;
import com.fptu.ojt.data.entities.Attachment;
import com.fptu.ojt.data.entities.Job;
import com.fptu.ojt.data.repositories.*;
import com.fptu.ojt.utils.JwtUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.thymeleaf.spring5.SpringTemplateEngine;

import javax.mail.MessagingException;
import javax.transaction.Transactional;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ApplicationServiceImpl implements ApplicationService {

    private static final Logger logger = LoggerFactory.getLogger(ApplicationServiceImpl.class);
    private final String APPLICATION_NOTIFICATION_SUBJECT = "New Application on OJT System";
    private final ApplicationRepository applicationRepository;
    private final JobRepository jobRepository;
    private final AccountRepository accountRepository;
    private final AttachmentRepository attachmentRepository;
    private final RepresentativeRepository  representativeRepository;
    private final JavaMailSender emailSender;
    private final SpringTemplateEngine templateEngine;

    public ApplicationServiceImpl(ApplicationRepository applicationRepository,
                                  JobRepository jobRepository,
                                  AccountRepository accountRepository, AttachmentRepository attachmentRepository, RepresentativeRepository representativeRepository, JavaMailSender emailSender, SpringTemplateEngine templateEngine) {
        this.applicationRepository = applicationRepository;
        this.jobRepository = jobRepository;
        this.accountRepository = accountRepository;
        this.attachmentRepository = attachmentRepository;
        this.representativeRepository = representativeRepository;
        this.emailSender = emailSender;
        this.templateEngine = templateEngine;
    }

    @Override
    public Page<Application> searchApplication(Specification<Application> specification, Pageable pageable) {
        return applicationRepository.findAll(specification, pageable);
    }

    @Override
    public Application getAppById(Long id, Long accountId)
            throws ApplicationNotExistedException, AccountIdNotExistedException {
        if (Boolean.FALSE.equals(applicationRepository.existsById(id))) {
            throw new ApplicationNotExistedException();
        }
        if (Boolean.FALSE.equals(accountRepository.existsById(id))) {
            throw new AccountIdNotExistedException();
        }
        Account account = accountRepository.getById(accountId);
        if (account.getRepresentative() != null) {
            return applicationRepository.getAppRep(id, account.getRepresentative().getCompany().getId());
        } else if (account.getStudent() != null) {
            return applicationRepository.getAppStudent(id, account.getStudent().getId());
        } else {
            return applicationRepository.getById(id);
        }
    }

    @Override
    public boolean deleteApplication(Long id, Long accountId)
            throws ApplicationNotExistedException, NotPermissionException {
        if (Boolean.FALSE.equals(applicationRepository.existsById(id))) {
            throw new ApplicationNotExistedException();
        }
        Application application = applicationRepository.getById(id);
        if (!application.isDisabled()) {
            if (application.getStudent().getAccount().getId().equals(accountId)) {
                application.setDisabled(true);
                applicationRepository.save(application);
                return true;
            } else {
                throw new NotPermissionException();
            }
        }
        return false;
    }

    @Override
    public Application updateApplication(Long id, ApplicationUpdateRequest applicationUpdateRequest, Long accountId)
            throws ApplicationNotExistedException, NotPermissionException, ApplicationDenied {
        if (Boolean.FALSE.equals(applicationRepository.existsById(id))) {
            throw new ApplicationNotExistedException();
        }
        Application application = applicationRepository.getById(id);
        if (application.isDisabled()) {
            throw new ApplicationNotExistedException();
        }

        Account account = accountRepository.getById(accountId);
        //student account id of application == student account id of account
        if (application.getStudent().getAccount().getId() == account.getId()) {
            //Student update exp
            application.setExperience(applicationUpdateRequest.getExperience());
        } else {
            throw new NotPermissionException();
        }

        return applicationRepository.save(application);
    }

    @Override
    @Transactional
    public Application createApplication(ApplicationCreateRequest applicationCreateRequest, Long accountId) throws MessagingException, CrudException {
        EmailUtil emailUtil = new EmailUtil();
        Account account = accountRepository.getById(accountId);

        if (account.getStudent() != null ) {
            if(account.getStudent().getOjtStatus() != -1) {
                throw new AlreadyConfirmACompanyException();
            }
            if(applicationRepository.existsByJobIdAndStudentId(applicationCreateRequest.getJobId(),account.getStudent().getId())) {
                throw new AlreadyHaveApplicationInThisJobException();
            }
            Job job = jobRepository.getById(applicationCreateRequest.getJobId());
            Application application = new Application();
            application.setExperience(applicationCreateRequest.getExperience());
            application.setJob(job);
            application.setStudent(account.getStudent());
            application.setStudentConfirmed(false);
            application.setCompanyAccepted(false);
            application = applicationRepository.save(application);

            List<String> attachmentKeys = applicationCreateRequest
                    .getAttachments().stream().map(AttachmentDTO::getKey).collect(Collectors.toList());
            if (!attachmentKeys.isEmpty() && attachmentKeys.stream().allMatch(key -> !key.isEmpty())) {
                List<Attachment> attachments = attachmentRepository.findAllByKeyIn(attachmentKeys);
                Application finalApplication = application;
                attachments.forEach(attachment -> attachment.setApplication(finalApplication));
                attachmentRepository.saveAll(attachments);
            }
            application = applicationRepository.getById(application.getId());

            Map<String,String> paramMap = new HashMap<>();
            paramMap.put("${StudentCode}",account.getStudent().getStudentCode());
            paramMap.put("${Name}",account.getName());
            paramMap.put("${Major}",account.getStudent().getMajor().getName());
            paramMap.put("${DownloadLink}","/storage/"+applicationCreateRequest.getAttachments().get(0).getKey());
            paramMap.put("${Position}",job.getName());
            Long companyID = representativeRepository.findByCompany(job.getCompany()).getAccount().getId();
            Account companyAccount = accountRepository.findById(companyID).orElse(null);
            if(companyAccount != null){
                String email = companyAccount.getEmail();
                logger.info("Sending email to " + email);
                emailUtil.notify(email,APPLICATION_NOTIFICATION_SUBJECT,
                        emailUtil.getTemplate(paramMap,this.templateEngine, "application_email_notification.html"), this.emailSender);
                return application;
            } else {
                throw new CrudException("Company Not Found", HttpStatus.BAD_REQUEST);
            }
        }
        return null;
    }


}
