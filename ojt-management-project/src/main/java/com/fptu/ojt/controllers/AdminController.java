package com.fptu.ojt.controllers;

import com.fptu.ojt.common.exceptions.CrudException;
import com.fptu.ojt.common.exceptions.NotPermissionException;
import com.fptu.ojt.common.exceptions.StudentNotFoundException;
import com.fptu.ojt.common.payload.ApplicationResponse;
import com.fptu.ojt.common.payload.OjtResultResponse;
import com.fptu.ojt.common.payload.dto.ApplicationDTO;
import com.fptu.ojt.common.payload.dto.EvaluationDTO;
import com.fptu.ojt.common.payload.dto.JobDTO;
import com.fptu.ojt.common.payload.dto.UserDTO;
import com.fptu.ojt.configuration.security.services.UserDetailsImpl;
import com.fptu.ojt.data.entities.Student;
import com.fptu.ojt.data.rsql.CustomRsqlVisitor;
import com.fptu.ojt.services.AdminService;
import com.fptu.ojt.services.CompanyService;
import cz.jirutka.rsql.parser.RSQLParser;
import cz.jirutka.rsql.parser.ast.Node;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.apache.logging.log4j.util.Strings;
import org.springframework.core.io.InputStreamResource;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.util.List;

@RestController
@RequestMapping("/admin")
@SecurityRequirement(name = "bearerAuth")
public class AdminController {

    private final AdminService adminService;
    private final CompanyService companyService;

    public AdminController(AdminService adminService, CompanyService companyService) {
        this.adminService = adminService;
        this.companyService = companyService;
    }

    @PreAuthorize("hasAnyAuthority('SYS_ADMIN')")
    @GetMapping("/get-all-student-list")
    public List<UserDTO> getAllStudentList(Authentication authentication) throws CrudException {
        Long accountId = ((UserDetailsImpl) authentication.getPrincipal()).getId();
        return adminService.getAllStudentList(accountId);
    }

    @PreAuthorize("hasAnyAuthority('SYS_ADMIN')")
    @GetMapping("/get-student-by-account-id/{id}")
    public UserDTO getStudentByAccountID(@PathVariable Long id) throws CrudException {
        return companyService.getStudentInfo(id);
    }

    @PreAuthorize("hasAnyAuthority('SYS_ADMIN')")
    @PostMapping(value = "/import-student-list", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public String importStudentList(@RequestParam("file") MultipartFile file) throws CrudException {
        int successfulImports = adminService.importStudentList(file);
        return "Successfully imported " + successfulImports + " Student(s)";
    }

    @PreAuthorize("hasAnyAuthority('SYS_ADMIN')")
    @GetMapping("/student-export")
    public ResponseEntity<InputStreamResource> exportStudentList(@RequestParam(value = "search", required = false) String search) throws StudentNotFoundException {
        Specification<Student> spec = Specification.where(null);
        if (Strings.isNotBlank(search)) {
            Node rootNode = new RSQLParser().parse(search);
            spec = rootNode.accept(new CustomRsqlVisitor<>());
        }
        ByteArrayInputStream stream = adminService.exportStudentList(spec);

        return ResponseEntity
                .ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,"attachment; filename=student-list.xlsx")
                .contentType(MediaType.parseMediaType("application/vnd.ms-excel"))
                .body(new InputStreamResource(stream));
    }

    @PreAuthorize("hasAnyAuthority('SYS_ADMIN')")
    @GetMapping("/get-all-application")
    public List<ApplicationResponse> getAllAppliaction(Authentication authentication)
            throws NotPermissionException {
        Long accountId = ((UserDetailsImpl) authentication.getPrincipal()).getId();
        return adminService.getAllApplication(accountId);
    }

    @PreAuthorize("hasAnyAuthority('SYS_ADMIN')")
    @GetMapping("/get-all-evaluation")
    public List<OjtResultResponse> getAllEvalutaion(Authentication authentication)
            throws NotPermissionException {
        Long accountId = ((UserDetailsImpl) authentication.getPrincipal()).getId();
        return adminService.getAllEvaluation(accountId);
    }

    @PreAuthorize("hasAnyAuthority('SYS_ADMIN')")
    @GetMapping("/get-jobs-by-company-id/{companyId}")
    public List<JobDTO> getAllJob(@PathVariable Long companyId, Authentication authentication)
            throws NotPermissionException {
        Long accountId = ((UserDetailsImpl) authentication.getPrincipal()).getId();
        return adminService.getJobsByCompanyId(accountId,companyId);
    }
}
