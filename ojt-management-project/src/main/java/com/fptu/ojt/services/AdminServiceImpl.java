package com.fptu.ojt.services;

import com.fptu.ojt.common.exceptions.*;
import com.fptu.ojt.common.payload.ApplicationResponse;
import com.fptu.ojt.common.payload.OjtResultResponse;
import com.fptu.ojt.common.payload.dto.*;
import com.fptu.ojt.common.utils.EmailUtil;
import com.fptu.ojt.data.entities.*;
import com.fptu.ojt.data.repositories.*;
import com.fptu.ojt.mappers.*;
import io.github.nambach.excelutil.core.DataTemplate;
import io.github.nambach.excelutil.core.Editor;
import io.github.nambach.excelutil.core.ReaderConfig;
import io.github.nambach.excelutil.style.BorderSide;
import io.github.nambach.excelutil.style.Style;
import org.apache.poi.ss.usermodel.HorizontalAlignment;
import org.apache.poi.ss.usermodel.VerticalAlignment;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring5.SpringTemplateEngine;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

@Service
public class AdminServiceImpl implements AdminService {
    private final StudentRepository studentRepository;
    private final AccountRepository accountRepository;
    private final UserMapper userMapper;
    private final MajorRepository majorRepository;
    private final SemesterRepository semesterRepository;
    private final PasswordEncoder encoder;
    private final JavaMailSender emailSender;
    private final SpringTemplateEngine templateEngine;
    private final ApplicationMapper applicationMapper;
    private final ApplicationRepository applicationRepository;
    private final EvaluationRepository evaluationRepository;
    private final EvaluationMapper evaluationMapper;
    private final JobRepository jobRepository;
    private final JobMapper jobMapper;
    private final AttachmentRepository attachmentRepository;
    private final AttachmentMapper attachmentMapper;

    private static final String REGISTER_SUBJECT = "New OJT System Account Created";

    public static final Style headerStyle = Style
            .builder()
            .fontName("Calibri").fontSize((short) 14)
            .fontColorInHex("#ffffff")  // white
            .backgroundColorInHex("#191970")  // midnight blue
            .border(BorderSide.FULL)
            .horizontalAlignment(HorizontalAlignment.LEFT)
            .bold(true)
            .build();
    public static final Style dataStyle = Style
            .builder()
            .fontName("Calibri")
            .backgroundColorInHex("#aadbee")
            .fontSize((short) 13)
            .border(BorderSide.FULL)
            .verticalAlignment(VerticalAlignment.CENTER)
            .build();

    public AdminServiceImpl(StudentRepository studentRepository,
                            AccountRepository accountRepository,
                            UserMapper userMapper,
                            MajorRepository majorRepository,
                            SemesterRepository semesterRepository,
                            PasswordEncoder encoder,
                            JavaMailSender emailSender,
                            SpringTemplateEngine templateEngine, ApplicationMapper applicationMapper, ApplicationRepository applicationRepository, EvaluationRepository evaluationRepository, EvaluationMapper evaluationMapper, JobRepository jobRepository, JobMapper jobMapper, AttachmentRepository attachmentRepository, AttachmentMapper attachmentMapper) {
        this.studentRepository = studentRepository;
        this.accountRepository = accountRepository;
        this.userMapper = userMapper;
        this.majorRepository = majorRepository;
        this.semesterRepository = semesterRepository;
        this.encoder = encoder;
        this.emailSender = emailSender;
        this.templateEngine = templateEngine;
        this.applicationMapper = applicationMapper;
        this.applicationRepository = applicationRepository;
        this.evaluationRepository = evaluationRepository;
        this.evaluationMapper = evaluationMapper;
        this.jobRepository = jobRepository;
        this.jobMapper = jobMapper;
        this.attachmentRepository = attachmentRepository;
        this.attachmentMapper = attachmentMapper;
    }

    @Override
    public List<UserDTO> getAllStudentList(Long accountId) throws CrudException {
        Account account = accountRepository.getAccountById(accountId);
        if (!account.isAdmin()) {
            throw new NotPermissionException();
        }
        List<Student> studentList = studentRepository.findAll();
        List<UserDTO> list = new ArrayList<>();
        for (Student s :
                studentList) {
            list.add(userMapper.userToUserDTO(s.getAccount()));
        }
        return list;
    }

    @Override
    public int importStudentList(MultipartFile file) throws CrudException {
        ReaderConfig<StudentImportDTO> readerConfig = getReaderConfigForStudentImport();
        List<StudentImportDTO> studentImportDTOs = new ArrayList<>();

        try {
            Editor editor = new Editor(file.getInputStream());
            studentImportDTOs = editor.readSection(readerConfig);
            editor.goToSheet("Import Sheet").goToCell(0, 0);
        } catch (IOException e) {
            throw new CrudException("Error reading imported file", HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            e.printStackTrace();
        }
        AtomicInteger successfulImports = new AtomicInteger(studentImportDTOs.size());
        studentImportDTOs = studentImportDTOs.stream().filter(studentImportDTO -> studentImportDTO.getStudentCode()!= null).collect(Collectors.toList());
        studentImportDTOs.forEach(studentImportDTO -> {
            try {
                this.registerStudent(studentImportDTO);
            } catch (MajorNotExistedException | SemesterNotExistedException | MessagingException e) {
                e.printStackTrace();
                successfulImports.addAndGet(-1);
            }
        });

        return (int) successfulImports.longValue();
    }

    @Override
    public ByteArrayInputStream exportStudentList(Specification<Student> specification) throws StudentNotFoundException {
        List<Student> studentList = studentRepository.findAll(specification);
        if(studentList.isEmpty()){
            throw new StudentNotFoundException();
        }
        DataTemplate<Student> studentDataTemplate = DataTemplate.fromClass(Student.class)
                .column(c -> c.title("Student Code").transform(h -> h.getStudentCode()))
                .column(c -> c.title("Name").transform(h -> h.getAccount().getName()))
                .column(c -> c.title("Address").transform(h -> h.getAddress()))
                .column(c -> c.title("Major").transform(h -> h.getMajor().getName()))
                .column(c -> c.title("On OJT").transform(h -> h.getApplications().stream().anyMatch(Application::isStudentConfirmed)))
                .column(c -> c.title("Is Passed").transform(h -> h.getApplications().stream().filter(application -> application.getEvaluation().isPass()).collect(Collectors.toList()).toString()))
                .config(cf -> cf.autoSizeColumns(true)
                        .headerStyle(headerStyle)
                        .dataStyle(dataStyle));
        InputStream stream =  studentDataTemplate.writeData(studentList);
        try (Editor editor = new Editor(stream)){
            editor.configSheet(cf -> cf.freeze(0,1));
            editor.setSheetName("Student list");
            return editor.exportToFile();
        }
    }

    @Override
    public List<ApplicationResponse> getAllApplication(Long accountId) throws NotPermissionException {
        if(!accountRepository.getAccountById(accountId).isAdmin()) {
            throw new NotPermissionException();
        }
        List<Application> applications = applicationRepository.getAllApplicationForAdmin();
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
    public List<OjtResultResponse> getAllEvaluation(Long accountId) throws NotPermissionException {
        if(!accountRepository.getAccountById(accountId).isAdmin()) {
            throw new NotPermissionException();
        }
        List<Evaluation> evaluations = evaluationRepository.findAll();
        if(evaluations != null) {
            List<OjtResultResponse> ojtResultResponses = new ArrayList<>();
            for (Evaluation e :
                    evaluations) {
                ojtResultResponses.add(new OjtResultResponse(e.getId(),
                        e.getApplication().getJob().getCompany().getName(),
                        e.getApplication().getStudent().getStudentCode(),
                        e.getApplication().getStudent().getAccount().getName(),
                        e.getApplication().getStudent().getMajor().getName(),
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
    public List<JobDTO> getJobsByCompanyId(Long accountId, Long companyId) throws NotPermissionException {
            Account account = accountRepository.getAccountById(accountId);
            if(!account.isAdmin()) {
                throw new NotPermissionException();
            }
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

    private void registerStudent(StudentImportDTO studentImportDTO) throws MajorNotExistedException, SemesterNotExistedException, MessagingException {
        EmailUtil emailUtil = new EmailUtil();
        Account account = new Account(studentImportDTO.getEmail(),
                encoder.encode(studentImportDTO.getPassword()),
                studentImportDTO.getName(),
                studentImportDTO.getPhone(),
                studentImportDTO.getAvatar()
        );
        account = accountRepository.save(account);
        if (studentImportDTO.getMajor() == null) {
            throw new MajorNotExistedException();
        }
        if (studentImportDTO.getSemester() == null) {
            throw new SemesterNotExistedException();
        }
        Student student = new Student();
        student.setStudentCode(studentImportDTO.getStudentCode());
        student.setMajor(studentImportDTO.getMajor());
        student.setSemester(studentImportDTO.getSemester());
        student.setAccount(account);
        student.setAddress(studentImportDTO.getAddress());
        student.setGpa(Integer.parseInt(studentImportDTO.getGpa()));
        student.setOjtStatus(-1);
        studentRepository.save(student);

        Map<String,String> paramMap = new HashMap<>();
        paramMap.put("${email}",studentImportDTO.getEmail());
        paramMap.put("${name}",studentImportDTO.getName());
        paramMap.put("${password}",studentImportDTO.getPassword());
        emailUtil.notify(studentImportDTO.getEmail(),REGISTER_SUBJECT, emailUtil.getTemplate(paramMap,this.templateEngine, "welcome.html"), this.emailSender);
    }

    private ReaderConfig<StudentImportDTO> getReaderConfigForStudentImport() {
        return ReaderConfig.fromClass(StudentImportDTO.class)
                .titleAtRow(0)
                .column(0, "studentCode")
                .column(1, "name")
                .column(2, "password")
                .column(3, "email")
                .column(4, "phone")
                .column(5, "avatar")
                .handler(set -> set.atColumn(6) //Semester
                        .handle((a, cell) -> {
                            try {
                                a.setSemester(semesterRepository.getByName(cell.readString()));
                            } catch (Exception e) {
                                e.printStackTrace();
                            }
                        }))
                .handler(set -> set.atColumn(7) //Major
                        .handle((a, cell) -> {
                            try {
                                a.setMajor(majorRepository.getByName(cell.readString()));
                            } catch (Exception e) {
                                e.printStackTrace();
                            }
                        })
                )
                .column(8, "address")
                .column(9, "gpa")
                .dataFromRow(1);
    }


}
