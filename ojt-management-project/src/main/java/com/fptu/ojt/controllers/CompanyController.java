package com.fptu.ojt.controllers;

import com.fptu.ojt.common.exceptions.CrudException;
import com.fptu.ojt.common.payload.ApplicationResponse;
import com.fptu.ojt.common.payload.JobResponse;
import com.fptu.ojt.common.payload.PagedDataResponse;
import com.fptu.ojt.common.payload.dto.ApplicationDTO;
import com.fptu.ojt.common.payload.dto.CompanyDTO;
import com.fptu.ojt.common.payload.dto.JobDTO;
import com.fptu.ojt.common.payload.dto.UserDTO;
import com.fptu.ojt.common.payload.request.ApplicationCreateRequest;
import com.fptu.ojt.common.payload.request.ApplicationUpdateRequest;
import com.fptu.ojt.common.payload.request.CompanyRequest;
import com.fptu.ojt.common.payload.request.ConfirmApplicationRequest;
import com.fptu.ojt.configuration.security.services.UserDetailsImpl;
import com.fptu.ojt.data.entities.Company;
import com.fptu.ojt.data.rsql.CustomRsqlVisitor;
import com.fptu.ojt.mappers.ApplicationMapper;
import com.fptu.ojt.mappers.CompanyMapper;
import com.fptu.ojt.mappers.StudentMapper;
import com.fptu.ojt.services.CompanyService;
import com.fptu.ojt.utils.SortUtils;
import cz.jirutka.rsql.parser.RSQLParser;
import cz.jirutka.rsql.parser.ast.Node;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.apache.logging.log4j.util.Strings;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import javax.mail.MessagingException;
import javax.validation.Valid;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/companies")
@SecurityRequirement(name = "bearerAuth")
public class CompanyController {

    private final CompanyMapper companyMapper;
    private final CompanyService companyService;
    private final StudentMapper studentMapper;
    private final ApplicationMapper applicationMapper;

    public CompanyController(CompanyMapper companyMapper,
                             CompanyService companyService, StudentMapper studentMapper, ApplicationMapper applicationMapper) {
        this.companyMapper = companyMapper;
        this.companyService = companyService;
        this.studentMapper = studentMapper;
        this.applicationMapper = applicationMapper;
    }

    @PreAuthorize("hasAnyAuthority('SYS_ADMIN', 'COMPANY_REPRESENTATIVE', 'SYS_ADMIN','STUDENT')")
    @GetMapping()
    public PagedDataResponse<CompanyDTO> searchCompany(@RequestParam(value = "search", required = false) String search,
                                                    @RequestParam(value = "pageNo", required = false, defaultValue = "0") Integer pageNo,
                                                    @RequestParam(value = "pageSize", required = false, defaultValue = "20") Integer pageSize,
                                                    @RequestParam(value = "sortBy", required = false, defaultValue = "id ASC") String sortBy) {
        Specification<Company> spec = Specification.where(null);
        if (Strings.isNotBlank(search)) {
            Node rootNode = new RSQLParser().parse(search);
            spec = rootNode.accept(new CustomRsqlVisitor<>());
        }
        Sort sort = SortUtils.parseSortQuery(sortBy);
        Pageable pageable = PageRequest.of(pageNo, pageSize, sort);
        Page<Company> pagedResult = companyService.searchCompany(spec, pageable);
        List<CompanyDTO> data = pagedResult.getContent().stream().map(companyMapper::companyToCompanyDTO).collect(Collectors.toList());

        return new PagedDataResponse<>("OK", "Retrieved account successfully.", data, pagedResult.getTotalElements(), pagedResult.getTotalPages(), pagedResult.getNumber());
    }

    @PreAuthorize("hasAnyAuthority('COMPANY_REPRESENTATIVE','SYS_ADMIN', 'STUDENT')")
    @GetMapping("/{id}")
    public CompanyDTO getCompanyId(@PathVariable Long id,
                                   Authentication authentication) throws CrudException {
        Long accountId = ((UserDetailsImpl) authentication.getPrincipal()).getId();
        return companyMapper.companyToCompanyDTO(companyService.getCompanyById(id, accountId));
    }

    @PreAuthorize("hasAnyAuthority('COMPANY_REPRESENTATIVE','SYS_ADMIN')")
    @PutMapping("/{id}")
    public CompanyDTO updateCompany(@PathVariable Long id,
                                    @RequestBody @Valid CompanyRequest companyUpdateRequest,
                                    Authentication authentication)
            throws CrudException {
        Long accountId = ((UserDetailsImpl) authentication.getPrincipal()).getId();
        return companyMapper.companyToCompanyDTO(companyService.updateCompany(id, companyUpdateRequest, accountId));
    }

    @PreAuthorize("hasAnyAuthority('COMPANY_REPRESENTATIVE')")
    @GetMapping("/get-student-list-to-offer")
    public List<UserDTO> getStudentListByCompanyID(Authentication authentication) throws CrudException {
        Long accountId =((UserDetailsImpl) authentication.getPrincipal()).getId();
        return companyService.getStudentListById(accountId);
    }

    @PreAuthorize("hasAnyAuthority('COMPANY_REPRESENTATIVE','SYS_ADMIN')")
    @GetMapping("/get-student-by-id/{id}")
    public UserDTO getStudentByAccountID(@PathVariable Long id) throws CrudException {
        return companyService.getStudentInfo(id);
    }

    @PreAuthorize("hasAnyAuthority('COMPANY_REPRESENTATIVE')")
    @GetMapping("/get-list-jobs-by-company-id")
    public List<JobDTO> getJobByCompanyID(Authentication authentication) throws CrudException {
        Long id =((UserDetailsImpl) authentication.getPrincipal()).getId();
        return companyService.getListJobById(id);
    }

    @PreAuthorize("hasAnyAuthority('COMPANY_REPRESENTATIVE')")
    @PutMapping("/confirm-application/{id}")
    public ApplicationDTO confirmApplication(@PathVariable Long id, @Valid@RequestBody ConfirmApplicationRequest confirmApplicationRequest,
                                             Authentication authentication) throws CrudException {
        Long accountId = ((UserDetailsImpl) authentication.getPrincipal()).getId();
        return applicationMapper.applicationToApplicationDTO(
                companyService.confirmApplication(id,confirmApplicationRequest,accountId));
    }

    @PreAuthorize("hasAnyAuthority('COMPANY_REPRESENTATIVE')")
    @PostMapping("/offer-student/{studentId}")
    public ApplicationDTO offerStudent(@PathVariable Long studentId,
                                       @RequestBody ApplicationCreateRequest applicationCreateRequest,
                                       Authentication authentication) throws CrudException, MessagingException {
        Long accountId = ((UserDetailsImpl) authentication.getPrincipal()).getId();
        return applicationMapper.applicationToApplicationDTO(companyService.offerStudent(applicationCreateRequest,
                accountId,studentId));
    }

    @PreAuthorize("hasAnyAuthority('COMPANY_REPRESENTATIVE')")
    @GetMapping("/get-list-applicaiton")
    public List<ApplicationResponse> getAllApplicaiton(Authentication authentication) throws CrudException {
        Long accountId = ((UserDetailsImpl) authentication.getPrincipal()).getId();
        return companyService.getAllApplication(accountId);
    }

    @PreAuthorize("hasAnyAuthority('COMPANY_REPRESENTATIVE')")
    @GetMapping("/get-jobs-suiable-for-student/{studentId}")
    public List<JobResponse> getJobsForSudent (@PathVariable Long studentId, Authentication authentication) throws CrudException {
        Long accountId = ((UserDetailsImpl) authentication.getPrincipal()).getId();
        return companyService.getJobsForStudent(studentId,accountId);
    }


}
