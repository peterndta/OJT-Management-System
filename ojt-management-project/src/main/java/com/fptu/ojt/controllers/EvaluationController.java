package com.fptu.ojt.controllers;

import com.fptu.ojt.common.exceptions.CrudException;
import com.fptu.ojt.common.exceptions.StudentNotFoundException;
import com.fptu.ojt.data.entities.Student;
import com.fptu.ojt.data.rsql.CustomRsqlVisitor;
import com.fptu.ojt.services.EvaluationService;
import cz.jirutka.rsql.parser.RSQLParser;
import cz.jirutka.rsql.parser.ast.Node;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.apache.logging.log4j.util.Strings;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;

@RestController
@RequestMapping("/evaluation")
@SecurityRequirement(name = "bearerAuth")
public class EvaluationController {

    EvaluationService evaluationService;

    public EvaluationController(EvaluationService evaluationService) {
        this.evaluationService = evaluationService;
    }

    @PostMapping(value= "/import", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAnyAuthority('SYS_ADMIN','COMPANY_REPRESENTATIVE')")
    public  String importEvaluation(@RequestParam("file") MultipartFile file) throws CrudException {
        int successfulImports = evaluationService.importEvaluation(file);
        return  "Successfully imported " + successfulImports + " Evaluation(s)";
    }

    @GetMapping("/export-ojt-student")
    public ResponseEntity<InputStreamResource> exportStudentOJTList(@RequestParam(value = "companyId") Long companyId) throws StudentNotFoundException {
        ByteArrayInputStream stream = evaluationService.getOnJobStudentList(companyId);

        return ResponseEntity
                .ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,"attachment; filename=on-job-student-list.xlsx")
                .contentType(MediaType.parseMediaType("application/vnd.ms-excel"))
                .body(new InputStreamResource(stream));
    }
}
