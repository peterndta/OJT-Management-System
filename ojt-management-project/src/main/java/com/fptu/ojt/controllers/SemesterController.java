package com.fptu.ojt.controllers;

import com.fptu.ojt.common.utils.SortUtils;
import com.fptu.ojt.data.entities.Semester;
import com.fptu.ojt.data.entities.Student;
import com.fptu.ojt.data.rsql.CustomRsqlVisitor;
import com.fptu.ojt.services.SemesterService;
import cz.jirutka.rsql.parser.RSQLParser;
import cz.jirutka.rsql.parser.ast.Node;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.apache.logging.log4j.util.Strings;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/semester")
@SecurityRequirement(name = "bearerAuth")
public class SemesterController {

    private final SemesterService semesterService;

    public SemesterController(SemesterService semesterService) {
        this.semesterService = semesterService;
    }

    @GetMapping("/get-all-semester")
    public Page<Semester> getAllSemester(@RequestParam(value = "search", required = false) String search,
                                         @RequestParam(value = "pageNo", required = false, defaultValue = "0") Integer pageNo,
                                         @RequestParam(value = "pageSize", required = false, defaultValue = "20") Integer pageSize,
                                         @RequestParam(value = "sortBy", required = false, defaultValue = "id ASC") String sortBy){
        Specification<Semester> spec = Specification.where(null);
        if (Strings.isNotBlank(search)) {
            Node rootNode = new RSQLParser().parse(search);
            spec = rootNode.accept(new CustomRsqlVisitor<>());
        }
        Sort sort = SortUtils.parseSortQuery(sortBy);
        Pageable pageable = PageRequest.of(pageNo, pageSize, sort);
        return semesterService.searchSemester(spec, pageable);
    }
}
