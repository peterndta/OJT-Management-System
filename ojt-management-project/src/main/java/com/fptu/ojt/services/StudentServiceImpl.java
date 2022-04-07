package com.fptu.ojt.services;

import com.fptu.ojt.common.exceptions.*;
import com.fptu.ojt.common.payload.ApplicationResponse;
import com.fptu.ojt.common.payload.OjtResultResponse;
import com.fptu.ojt.common.payload.dto.JobDTO;
import com.fptu.ojt.common.payload.dto.UserDTO;
import com.fptu.ojt.common.payload.request.VerifyApplicationRequest;
import com.fptu.ojt.data.entities.*;
import com.fptu.ojt.data.repositories.*;
import com.fptu.ojt.mappers.AttachmentMapper;
import com.fptu.ojt.mappers.JobMapper;
import com.fptu.ojt.mappers.StudentMapper;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

@Service
public class StudentServiceImpl implements StudentService{
    private final AccountRepository accountRepository;
    private final JobRepository jobRepository;
    private final EvaluationRepository evaluationRepository;
    private final JobMapper jobMapper;
    private final ApplicationRepository applicationRepository;
    private final AttachmentMapper attachmentMapper;
    private final AttachmentRepository attachmentRepository;
    private final StudentMapper studentMapper;

    public StudentServiceImpl(AccountRepository accountRepository, JobRepository jobRepository, EvaluationRepository evaluationRepository, JobMapper jobMapper, ApplicationRepository applicationRepository, AttachmentMapper attachmentMapper, AttachmentRepository attachmentRepository, StudentMapper studentMapper) {
        this.accountRepository = accountRepository;
        this.jobRepository = jobRepository;
        this.evaluationRepository = evaluationRepository;
        this.jobMapper = jobMapper;
        this.applicationRepository = applicationRepository;
        this.attachmentMapper = attachmentMapper;
        this.attachmentRepository = attachmentRepository;
        this.studentMapper = studentMapper;
    }

    @Override
    public List<JobDTO> getListJobByAccountId(Long id) throws NotPermissionException {
        Account account = accountRepository.getAccountById(id);
        if(account.getStudent() == null) {
            throw new NotPermissionException();
        }
        Long majorId = account.getStudent().getMajor().getId();
        Long semesterId = account.getStudent().getSemester().getId();
        List<Job> jobList = jobRepository.getAllByMajorIdAndSemesterId(majorId,semesterId);
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
    public List<JobDTO> getListJobByAccountIdAndCompanyId(Long accountId, Long companyId) throws NotPermissionException, CompanyNotExistedException {
        Account account = accountRepository.getAccountById(accountId);
        if(account.getStudent() == null) {
            throw new NotPermissionException();
        }
        Long majorId = account.getStudent().getMajor().getId();
        Long semesterId = account.getStudent().getSemester().getId();
        if(!jobRepository.existsByCompanyId(companyId)) {
            throw new CompanyNotExistedException();
        }
        List<Job> jobList = jobRepository.getAllByMajorIdAndSemesterIdAndCompanyId(majorId,semesterId,companyId);
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
    public Application verifyApplication(Long id, VerifyApplicationRequest verifyApplicationRequest, Long accountId)
            throws CrudException {
        if (Boolean.FALSE.equals(applicationRepository.existsById(id))) {
            throw new ApplicationNotExistedException();
        }
        Application application = applicationRepository.getById(id);
        if (application.isDisabled()) {
            throw new ApplicationNotExistedException();
        }
        if(application.getStudent().getOjtStatus() != -1) {
            throw new AlreadyConfirmACompanyException();
        }
        Account account = accountRepository.getById(accountId);
        if (application.getStudent().getAccount().getId() == account.getId()) {
            //Student confirm application
            if (application.isCompanyAccepted()) {
                application.setStudentConfirmed(verifyApplicationRequest.isStudentConfirmed());
                application.setConfirmedAt(new Timestamp(System.currentTimeMillis()));
                application.getStudent().setOjtStatus(0);
            } else {
                throw new NotPermissionException();
            }
        } else {
            throw new NotPermissionException();
        }
        return applicationRepository.save(application);
    }

    @Override
    public List<ApplicationResponse> getAllApplication(Long accountId) throws CrudException {
        Account account = accountRepository.getAccountById(accountId);
        if(account.getStudent() == null) {
            throw new NotPermissionException();
        }
        List<Application> applications = applicationRepository.getAllApplicationByStudentId(account.getStudent().getId());
        if(applications != null) {
            List<ApplicationResponse> applicationResponses = new ArrayList<>();
            for (Application a :
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
    public List<OjtResultResponse> getAllOjtResult(Long accountId) throws CrudException {
        Account account = accountRepository.getAccountById(accountId);
        if(account.getStudent() == null) {
            throw new NotPermissionException();
        }
        List<Evaluation> evaluations = evaluationRepository.getAllByStudentId(account.getStudent().getId());
        if(evaluations != null) {
            List<OjtResultResponse> ojtResultResponses = new ArrayList<>();
            for (Evaluation e :
                    evaluations) {
                ojtResultResponses.add(new OjtResultResponse(e.getId(),
                        e.getApplication().getJob().getCompany().getName(),
                        account.getStudent().getStudentCode(),
                        account.getName(),
                        account.getStudent().getMajor().getName(),
                        e.getApplication().getJob().getName(),
                        e.getGrade(),
                        e.isPass(),
                        e.getComment()));
            }
            return ojtResultResponses;
        }
        return null;
    }

    @Override
    public UserDTO studentToUserDto(Student student) {

        if ( student == null ) {
            return null;
        }

        Account account = student.getAccount();
        UserDTO userDTO = new UserDTO();

        userDTO.setRole( "STUDENT" );
        userDTO.setStudent( studentMapper.studentToStudentDTO(student) );
        userDTO.setId( account.getId() );
        userDTO.setName( account.getName() );
        userDTO.setEmail( account.getEmail() );
        userDTO.setPhone( account.getPhone() );
        userDTO.setCreatedAt( account.getCreatedAt() );
        userDTO.setUpdatedAt( account.getUpdatedAt() );
        userDTO.setDisabled( account.isDisabled() );

        return userDTO;
    }


}
