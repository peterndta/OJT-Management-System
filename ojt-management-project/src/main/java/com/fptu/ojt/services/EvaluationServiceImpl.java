package com.fptu.ojt.services;

import com.fptu.ojt.common.exceptions.AccountIdNotExistedException;
import com.fptu.ojt.common.exceptions.CrudException;
import com.fptu.ojt.common.exceptions.EvaluationIdNotExistedException;
import com.fptu.ojt.common.exceptions.NotPermissionException;
import com.fptu.ojt.common.payload.ApplicationResponse;
import com.fptu.ojt.common.payload.dto.EvaluationImportDTO;
import com.fptu.ojt.common.payload.dto.OnJobStudentDTO;
import com.fptu.ojt.common.payload.request.EvaluationCreateRequest;
import com.fptu.ojt.common.payload.request.EvaluationUpdateRequest;
import com.fptu.ojt.data.entities.*;
import com.fptu.ojt.data.repositories.*;
import io.github.nambach.excelutil.core.DataTemplate;
import io.github.nambach.excelutil.core.Editor;
import io.github.nambach.excelutil.core.ReaderConfig;
import io.github.nambach.excelutil.style.BorderSide;
import io.github.nambach.excelutil.style.Style;
import org.apache.poi.ss.usermodel.HorizontalAlignment;
import org.apache.poi.ss.usermodel.VerticalAlignment;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.*;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

@Service
public class EvaluationServiceImpl implements EvaluationService {

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
    private static final Logger logger = LoggerFactory.getLogger(EvaluationServiceImpl.class);
    private final EvaluationRepository evaluationRepository;
    private final AccountRepository accountRepository;
    private final ApplicationRepository applicationRepository;
    private final JobRepository jobRepository;
    private final CompanyRepository companyRepository;
    private final StudentRepository studentRepository;
    private final SemesterRepository semesterRepository;

    public EvaluationServiceImpl(EvaluationRepository evaluationRepository,
                                 AccountRepository accountRepository,
                                 ApplicationRepository applicationRepository,
                                 JobRepository jobRepository,
                                 CompanyRepository companyRepository,
                                 StudentRepository studentRepository,
                                 SemesterRepository semesterRepository) {
        this.evaluationRepository = evaluationRepository;
        this.accountRepository = accountRepository;
        this.applicationRepository = applicationRepository;
        this.jobRepository = jobRepository;
        this.companyRepository = companyRepository;
        this.studentRepository = studentRepository;
        this.semesterRepository = semesterRepository;
    }

    @Override
    public Page<Evaluation> searchEvaluation(Specification<Evaluation> specification, Pageable pageable) {
        return evaluationRepository.findAll(specification, pageable);
    }

    @Override
    public Evaluation getEvaluationById(Long id, Long accountId)
            throws EvaluationIdNotExistedException, AccountIdNotExistedException {
        if (Boolean.FALSE.equals(evaluationRepository.existsById(id))) {
            throw new EvaluationIdNotExistedException();
        }
        if (Boolean.FALSE.equals(accountRepository.existsById(accountId))) {
            throw new AccountIdNotExistedException();
        }
        if (accountRepository.getById(accountId).getRepresentative() != null) {
            return evaluationRepository.getEvaluationRep(accountRepository.getById(accountId).getRepresentative().getCompany().getId(), id);
        } else {
            return evaluationRepository.getEvaluationStudent(accountRepository.getById(accountId).getStudent().getId(), id);
        }
    }

    @Override
    public Evaluation updateEvaluation(Long id, EvaluationUpdateRequest evaluationUpdateRequest, Long companyId)
            throws EvaluationIdNotExistedException {
        if (Boolean.FALSE.equals(evaluationRepository.existsById(id))) {
            throw new EvaluationIdNotExistedException();
        }

        Evaluation evaluation = evaluationRepository.getEvaluationRep(companyId, id);
        evaluation.setComment(evaluationUpdateRequest.getComment());
        evaluation.setGrade(evaluationUpdateRequest.getGrade());
        evaluation.setPass(evaluationUpdateRequest.isPass());
        evaluationRepository.save(evaluation);
        return evaluation;
    }

    @Override
    public Evaluation createEvaluation(EvaluationCreateRequest evaluationCreateRequest, Long companyId)
            throws NotPermissionException {
        Evaluation evaluation = new Evaluation();
        Application application = applicationRepository.getById(evaluationCreateRequest.getApplicationId());
        if (application.getJob().getCompany().getId() == companyId) {
            evaluation.setGrade(evaluationCreateRequest.getGrade());
            evaluation.setComment(evaluationCreateRequest.getComment());
            evaluation.setPass(evaluationCreateRequest.isPass());
            evaluation.setApplication(application);
            evaluation = evaluationRepository.save(evaluation);
            application.setEvaluation(evaluation);
            applicationRepository.save(application);
            return evaluation;
        } else {
            throw new NotPermissionException();
        }
    }

    @Override
    public int importEvaluation(MultipartFile file) throws CrudException {
        ReaderConfig<EvaluationImportDTO> readerConfig = this.getReaderConfigForEvaluationImport();
        List<EvaluationImportDTO> evaluationImportDTOList = new ArrayList<>();

        try {
            Editor editor = new Editor(file.getInputStream());
            evaluationImportDTOList = editor.readSection(readerConfig);
            evaluationImportDTOList = evaluationImportDTOList.stream().filter(evaluationImportDTO -> evaluationImportDTO.getEmail() != null).collect(Collectors.toList());
            editor.goToSheet("Import Sheet").goToCell(0, 0);
        } catch (IOException e) {
            throw new CrudException("Error reading imported file", HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            e.printStackTrace();
        }
        AtomicInteger successfulImport = new AtomicInteger(evaluationImportDTOList.size());
        evaluationImportDTOList.forEach(evaluationImportDTO -> {
            try {
                this.initNewEvaluation(evaluationImportDTO);
            } catch (CrudException e) {
                e.printStackTrace();
                successfulImport.addAndGet(-1);
            }
        });
        return (int) successfulImport.longValue();
    }

    @Override
    public ByteArrayInputStream getOnJobStudentList(Long companyId) {
        Semester currentSemester = semesterRepository.getCurrentSemester(Calendar.getInstance().getTime()).get(0);
        Set<Job> currentSemesterJob = currentSemester.getJobs().stream().map(job -> {
            if (Objects.equals(job.getCompany().getId(), companyId) && job.getSemesters().contains(currentSemester)) {
                return job;
            }
            return null;
        }).collect(Collectors.toSet());
        currentSemesterJob.remove(null);

        DataTemplate<OnJobStudentDTO> onJobStudentDTODataTemplate = DataTemplate.fromClass(OnJobStudentDTO.class)
                .column(c -> c.title("Student Code").transform(OnJobStudentDTO::getStudentCode))
                .column(c -> c.title("Email").transform(OnJobStudentDTO::getEmail))
                .column(c -> c.title("Job Name").transform(OnJobStudentDTO::getJobName))
                .column(c -> c.title("Company Name").transform(OnJobStudentDTO::getCompanyName))
                .column(c -> c.title("Comment").transform(OnJobStudentDTO::getComment))
                .column(c -> c.title("Grade").transform(OnJobStudentDTO::getGrade))
                .column(c -> c.title("Is Passed").transform(OnJobStudentDTO::getIsPassed))
                .config(cf -> cf.autoSizeColumns(true)
                        .headerStyle(headerStyle)
                        .dataStyle(dataStyle));

        List<OnJobStudentDTO> onJobStudentDTOS = this.initOnJobStudentDtoList(currentSemesterJob, currentSemester);
        onJobStudentDTOS.removeAll(Collections.singleton(null));
        InputStream stream = onJobStudentDTODataTemplate.writeData(onJobStudentDTOS);
        try (Editor editor = new Editor(stream)) {
            editor.configSheet(cf -> cf.freeze(0, 1));
            editor.setSheetName("Import Sheet");
            return editor.exportToFile();
        }
    }

    private List<OnJobStudentDTO> initOnJobStudentDtoList(Set<Job> jobSet, Semester currentSemester) {
        List<OnJobStudentDTO> result = new ArrayList<>();
        for (Job job : jobSet) {
            if (job.getApplications() != null) {
                result.addAll(this.getOnJobStudentFromJob(job.getApplications(), currentSemester));
            }
        }
        return result;
    }

    private List<OnJobStudentDTO> getOnJobStudentFromJob(Set<Application> applications, Semester currentSemester) {
        List<OnJobStudentDTO> result = new ArrayList<>();
        for (Application application :
                applications) {
            if (application != null) {
                if (application.isStudentConfirmed() && application.getJob().getSemesters().contains(currentSemester)) {
                    OnJobStudentDTO onJobStudentDTO = new OnJobStudentDTO();
                    onJobStudentDTO.setStudentCode(application.getStudent().getStudentCode());
                    onJobStudentDTO.setEmail(application.getStudent().getAccount().getEmail());
                    onJobStudentDTO.setCompanyName(application.getJob().getCompany().getName());
                    onJobStudentDTO.setJobName(application.getJob().getName());
                    onJobStudentDTO.setComment(application.getEvaluation() != null ? application.getEvaluation().getComment():null);
                    onJobStudentDTO.setGrade(application.getEvaluation() != null ? application.getEvaluation().getGrade().toString() : null);
                    onJobStudentDTO.setIsPassed(application.getEvaluation() != null ? (application.getEvaluation().isPass() ? "Passed" : "Not Passed"): null);
                    result.add(onJobStudentDTO);
                }
            }
        }
        return result;
    }


    private ReaderConfig<EvaluationImportDTO> getReaderConfigForEvaluationImport() {
        return ReaderConfig.fromClass(EvaluationImportDTO.class)
                .titleAtRow(0)
                .column(0, "studentCode")
                .column(1, "email")
                .column(2, "jobName")
                .column(3, "companyName")
                .column(4, "comment")
                .column(5, "grade")
                .column(6, "isPassed")
                .dataFromRow(1);
    }

    private void initNewEvaluation(EvaluationImportDTO evaluationImportDTO) throws CrudException {
        EvaluationCreateRequest evaluationCreateRequest = new EvaluationCreateRequest();
        //Get Application id
        Company company = companyRepository.getCompanyByName(evaluationImportDTO.getCompanyName());
        List<Job> jobList = jobRepository.getJobByCompany(company);
        jobList.remove(null);
        Job studentJob = jobList.stream().filter(job -> job.getName().equalsIgnoreCase(evaluationImportDTO.getJobName())).findAny().orElse(null);
        Student student = studentRepository.getStudentByStudentCode(evaluationImportDTO.getStudentCode());
        if (studentJob != null) {
            Application application = applicationRepository.getApplicationByJobAndStudentAndIsStudentConfirmed(studentJob.getId(), student.getId());
            if (application == null) {
                throw new CrudException("Application not found", HttpStatus.BAD_REQUEST);
            }
            evaluationCreateRequest.setApplicationId(application.getId());
            evaluationCreateRequest.setComment(evaluationImportDTO.getComment());
            evaluationCreateRequest.setPass(evaluationImportDTO.getIsPassed().equalsIgnoreCase("passed"));
            evaluationCreateRequest.setGrade(Long.parseLong(evaluationImportDTO.getGrade()));
            if(evaluationCreateRequest.isPass()) {
                student.setOjtStatus(1);
            } else {
                student.setOjtStatus(2);
            }

            if (application.getEvaluation() != null) {
                this.updateEvaluation(application.getEvaluation().getId(), evaluationCreateRequest, company.getId());
            } else {
                this.createEvaluation(evaluationCreateRequest, company.getId());
            }
        } else {
            throw new CrudException("Job not found", HttpStatus.BAD_REQUEST);
        }
    }
}
