package com.fptu.ojt.services;

import com.fptu.ojt.common.exceptions.*;
import com.fptu.ojt.common.payload.ApplicationResponse;
import com.fptu.ojt.common.payload.JobResponse;
import com.fptu.ojt.common.payload.dto.JobDTO;
import com.fptu.ojt.common.payload.dto.UserDTO;
import com.fptu.ojt.common.payload.request.ApplicationCreateRequest;
import com.fptu.ojt.common.payload.request.CompanyRequest;
import com.fptu.ojt.common.payload.request.ConfirmApplicationRequest;
import com.fptu.ojt.common.utils.EmailUtil;
import com.fptu.ojt.data.entities.*;
import com.fptu.ojt.data.repositories.*;
import com.fptu.ojt.mappers.AttachmentMapper;
import com.fptu.ojt.mappers.JobMapper;
import com.fptu.ojt.mappers.UserMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.thymeleaf.spring5.SpringTemplateEngine;

import javax.mail.MessagingException;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class CompanyServiceImpl implements CompanyService {

    private final CompanyRepository companyRepository;
    private final AccountRepository accountRepository;
    private final RepresentativeRepository representativeRepository;
    private final StudentRepository studentRepository;
    private final JobRepository jobRepository;
    private final UserMapper userMapper;
    private final JobMapper jobMapper;
    private final ApplicationRepository applicationRepository;
    private final AttachmentRepository attachmentRepository;
    private final AttachmentMapper attachmentMapper;
    private final SpringTemplateEngine templateEngine;
    private final JavaMailSender emailSender;
    private final StudentService studentService;

    private final String OFFER_SUBJECT = "You Received New OJT Offer";

    public CompanyServiceImpl(CompanyRepository companyRepository,
                              AccountRepository accountRepository,
                              RepresentativeRepository representativeRepository,
                              StudentRepository studentRepository,
                              JobRepository jobRepository,
                              UserMapper userMapper,
                              JobMapper jobMapper,
                              ApplicationRepository applicationRepository,
                              AttachmentRepository attachmentRepository,
                              AttachmentMapper attachmentMapper,
                              SpringTemplateEngine templateEngine,
                              JavaMailSender emailSender,
                              StudentService studentService) {
        this.companyRepository = companyRepository;
        this.accountRepository = accountRepository;
        this.representativeRepository = representativeRepository;
        this.studentRepository = studentRepository;
        this.jobRepository = jobRepository;
        this.userMapper = userMapper;
        this.jobMapper = jobMapper;
        this.applicationRepository = applicationRepository;
        this.attachmentRepository = attachmentRepository;
        this.attachmentMapper = attachmentMapper;
        this.templateEngine = templateEngine;
        this.emailSender = emailSender;
        this.studentService = studentService;
    }

    @Override
    public Page<Company> searchCompany(Specification<Company> specification, Pageable pageable) {
        return companyRepository.findAll(specification, pageable);
    }

    @Override
    public Company updateCompany(Long id, CompanyRequest companyRequest, Long accountId) throws CrudException, CompanyNotExistedException {
        if (!companyRepository.existsById(id)) {
            throw new CompanyNotExistedException();
        }
        Company company = companyRepository.getById(id);
        company.setName(companyRequest.getName());
        company.setDescription(companyRequest.getDescription());
        company.setAddress(companyRequest.getAddress());

        return companyRepository.save(company);
    }

    @Override
    public Company getCompanyById(Long id, Long accountId) throws CrudException {
        Account account = accountRepository.getById(accountId);
        if (account.getRepresentative() != null) { //The Rep only get their company
            Long repCompanyId = accountRepository.getById(accountId).getRepresentative().getCompany().getId();
            if (!id.equals(repCompanyId)) {
                throw new CompanyNotExistedException();
            }
        } else { //The other role can get all
            if (Boolean.FALSE.equals(companyRepository.existsById(id))) {
                throw new CompanyNotExistedException();
            }
        }
        return companyRepository.getById(id);
    }

    @Override
    public List<UserDTO> getStudentListById(Long accountId) throws CrudException {
        Account account = accountRepository.getAccountById(accountId);
        if(account.getRepresentative() == null){
            throw new NotPermissionException();
        }
        Long companyId = accountRepository.getAccountById(accountId).getRepresentative().getCompany().getId();
        List<Major> majorList = jobRepository.getMajorsByCompanyID(companyId);
        if(majorList != null) {
            List<Student> studentList = studentRepository.getStudentsByMajorInAndOjtStatus(majorList, -1);
            if(studentList != null) {
                List<UserDTO> userList = new ArrayList<>();
                for (Student s :
                        studentList) {
                    userList.add(studentService.studentToUserDto(s));
                }
                return userList;
            }
        }
        return null;

    }

    @Override
    public UserDTO getStudentInfo(Long id) throws CrudException {
        return userMapper.userToUserDTO(accountRepository.getAccountById(id));
    }

    @Override
    public List<JobDTO> getListJobById(Long id) throws CrudException {
        Account account = accountRepository.getAccountById(id);
        if(account.getRepresentative() == null) {
            throw new NotPermissionException();
        }
        Long companyId = account.getRepresentative().getCompany().getId();
        List<Job> jobList = jobRepository.getJobsByCompanyId(companyId);
        if(jobList != null) {
            List<JobDTO> jobDTOList = new ArrayList<>();
            for (Job job:
                    jobList) {
                jobDTOList.add(jobMapper.jobToJobDTO(job));
            }
            return jobDTOList;
        }
        return null;
    }

    @Override
    public Application confirmApplication(Long id, ConfirmApplicationRequest confirmApplicationRequest, Long accountId) throws CrudException {
        if (Boolean.FALSE.equals(applicationRepository.existsById(id))) {
            throw new ApplicationNotExistedException();
        }
        Application application = applicationRepository.getById(id);
        if (application.isDisabled()) {
            throw new ApplicationNotExistedException();
        }
        Account account = accountRepository.getById(accountId);
        if (account.getRepresentative() != null && (application.getJob().getCompany().getId() == account.getRepresentative().getCompany().getId())) {
                application.setCompanyAccepted(confirmApplicationRequest.isCompanyAccepted());
                application.setAcceptedAt(new Timestamp(System.currentTimeMillis()));

        } else {
            throw new NotPermissionException();
        }
        return applicationRepository.save(application);
    }

    @Override
    public Application offerStudent(ApplicationCreateRequest applicationCreateRequest, Long accountId, Long studentId) throws CrudException, MessagingException {
        Account account = accountRepository.getById(accountId);
        EmailUtil emailUtil = new EmailUtil();
        if (account.getRepresentative() != null) {
            Account studentAccount = accountRepository.getAccountByStudentId(studentId);
            Student student = studentAccount.getStudent();
            if(student.getOjtStatus() != -1) {
                throw new StudentHaveOJTException();
            }
            if(applicationRepository.existsByJobIdAndStudentId(applicationCreateRequest.getJobId(), studentId)) {
                throw new AlreadyHaveApplicationInThisJobException();
            }
            Job job = jobRepository.getById(applicationCreateRequest.getJobId());
            Application application = new Application();
            application.setJob(job);
            application.setStudent(studentRepository.getStudentById(studentId));
            application.setStudentConfirmed(false);
            application.setCompanyAccepted(true);
            application.setAcceptedAt(new Timestamp(System.currentTimeMillis()));
            application = applicationRepository.save(application);

            Map<String,String> paramMap  = new HashMap<>();
            paramMap.put("${Company}",job.getCompany().getName());
            paramMap.put("${JobTitle}",job.getTitle());
            paramMap.put("${Description}", job.getDescription());
            paramMap.put("${Salary}",job.getSalary());
            emailUtil.notify(studentAccount.getEmail(),OFFER_SUBJECT,emailUtil.getTemplate(paramMap,this.templateEngine,"offer_email_notification.html"), this.emailSender);
            return application;
        }
        return null;
    }

    @Override
    public List<ApplicationResponse> getAllApplication(Long accountId) throws CrudException {
        Account account = accountRepository.getAccountById(accountId);
        if(account.getRepresentative() == null) {
            throw new NotPermissionException();
        }
        List<Application> applications = applicationRepository.getApplicationByCompanyId(
                account.getRepresentative().getCompany().getId());
        if(applications != null) {
            List<ApplicationResponse> applicationResponses = new ArrayList<>();
            for (Application a:
                 applications) {
                applicationResponses.add(new ApplicationResponse(a.getId(),
                        a.getStudent().getAccount().getEmail(),
                        a.getStudent().getAccount().getName(),
                        a.getStudent().getStudentCode(),
                        a.getStudent().getMajor().getName(),
                        a.getJob().getName(),
                        a.getJob().getCompany().getName(),
                        a.getStudent().getGpa(),
                        a.getExperience(),
                        a.isStudentConfirmed(),
                        a.isCompanyAccepted(),
                        attachmentMapper.attachmentToAttachmentDTO(attachmentRepository.findByApplicationId(a.getId()))));
            }
            return applicationResponses;
        }
        return null;
    }

    @Override
    public List<JobResponse> getJobsForStudent(Long studentId, Long accountId) throws CrudException {
        Account account = accountRepository.getAccountById(accountId);
        if(account.getRepresentative() == null) {
            throw new NotPermissionException();
        }
        if(!studentRepository.existsById(studentId)) {
            throw new StudentNotExistedException();
        }
        Student student = studentRepository.getStudentById(studentId);
        List<Job> jobs = jobRepository.getAllByMajorIdAndSemesterIdAndCompanyId(student.getMajor().getId(),
                student.getSemester().getId(),
                account.getRepresentative().getCompany().getId());
        if(jobs != null) {
            List<JobResponse> jobList = new ArrayList<>();
            for (Job j :
                    jobs) {
                jobList.add(new JobResponse(j.getId(),j.getName()));
            }
            return jobList;
        }
        return null;
    }

}
