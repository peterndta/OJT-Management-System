package com.fptu.ojt.controllers;
import com.fptu.ojt.common.exceptions.CrudException;
import com.fptu.ojt.common.exceptions.JobNotExistedException;
import com.fptu.ojt.common.payload.PagedDataResponse;
import com.fptu.ojt.common.payload.dto.JobDTO;
import com.fptu.ojt.common.payload.request.JobCreateRequest;
import com.fptu.ojt.common.payload.request.JobRequest;
import com.fptu.ojt.common.utils.SortUtils;
import com.fptu.ojt.configuration.security.services.UserDetailsImpl;
import com.fptu.ojt.data.entities.Job;
import com.fptu.ojt.data.rsql.CustomRsqlVisitor;
import com.fptu.ojt.mappers.JobMapper;
import com.fptu.ojt.services.JobService;
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

import javax.validation.Valid;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/jobs")
@SecurityRequirement(name = "bearerAuth")
public class JobController {

    private final JobService jobService;
    private final JobMapper jobMapper;

    public JobController(JobMapper jobMapper, JobService jobService) {
        this.jobMapper = jobMapper;
        this.jobService = jobService;
    }

    @PreAuthorize("hasAnyAuthority('COMPANY_REPRESENTATIVE','SYS_ADMIN', 'STUDENT')")
    @GetMapping()
    public PagedDataResponse<JobDTO> searchJobs(@RequestParam(value = "search", required = false) String search,
                                                @RequestParam(value = "pageNo", required = false, defaultValue = "0") Integer pageNo,
                                                @RequestParam(value = "pageSize", required = false, defaultValue = "20") Integer pageSize,
                                                @RequestParam(value = "sortBy", required = false, defaultValue = "id ASC") String sortBy) {
        Specification<Job> spec = Specification.where(null);
        if (Strings.isNotBlank(search)) {
            Node rootNode = new RSQLParser().parse(search);
            spec = rootNode.accept(new CustomRsqlVisitor<>());
        }
        Sort sort = SortUtils.parseSortQuery(sortBy);
        Pageable pageable = PageRequest.of(pageNo, pageSize, sort);
        Page<Job> pagedResult = jobService.searchJob(spec, pageable);
        List<JobDTO> data = pagedResult.getContent().stream().map(jobMapper::jobToJobDTO).collect(Collectors.toList());

        return new PagedDataResponse<>("OK", "Retrieved account successfully.", data, pagedResult.getTotalElements(), pagedResult.getTotalPages(), pagedResult.getNumber());
    }


    @PreAuthorize("hasAnyAuthority('COMPANY_REPRESENTATIVE','SYS_ADMIN', 'STUDENT')")
    @GetMapping("/{id}")
    public JobDTO getById(@PathVariable Long id, Authentication authentication) throws JobNotExistedException {
        Long accountId = ((UserDetailsImpl) authentication.getPrincipal()).getId();
        return jobMapper.jobToJobDTO(jobService.getById(id, accountId));
    }

    @PreAuthorize("hasAnyAuthority('COMPANY_REPRESENTATIVE','SYS_ADMIN')")
    @PutMapping("/{id}")
    public JobDTO updateJob(@PathVariable Long id,
                            @Valid @RequestBody JobRequest jobUpdateRequest,
                            Authentication authentication)
            throws CrudException {
        Long accountId = ((UserDetailsImpl) authentication.getPrincipal()).getId();
        return jobMapper.jobToJobDTO(jobService.updateJob(id, jobUpdateRequest, accountId));
    }

    @PreAuthorize("hasAnyAuthority('COMPANY_REPRESENTATIVE','SYS_ADMIN')")
    @DeleteMapping("/{id}")
    public boolean deleteJob(@PathVariable Long id,
                             Authentication authentication)
            throws JobNotExistedException {
        Long accountId = ((UserDetailsImpl) authentication.getPrincipal()).getId();
        return jobService.deleteJob(id, accountId);
    }

    @PreAuthorize("hasAnyAuthority('COMPANY_REPRESENTATIVE','SYS_ADMIN')")
    @PostMapping("/create-job")
    public JobDTO createJob(@Valid @RequestBody JobCreateRequest jobCreateRequest,
                            Authentication authentication)
            throws CrudException {
        Long accountId = ((UserDetailsImpl) authentication.getPrincipal()).getId();
        return jobMapper.jobToJobDTO(jobService.createJob(jobCreateRequest, accountId));
    }
}