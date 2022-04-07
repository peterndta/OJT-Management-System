package com.fptu.ojt.services;

import com.fptu.ojt.common.exceptions.CrudException;
import com.fptu.ojt.common.exceptions.JobNotExistedException;
import com.fptu.ojt.common.payload.request.JobCreateRequest;
import com.fptu.ojt.common.payload.request.JobRequest;
import com.fptu.ojt.data.entities.Job;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

public interface JobService {

    Page<Job> searchJob(Specification<Job> specification, Pageable pageable);

    Job getById(Long id, Long accountId) throws JobNotExistedException;

    Job updateJob(Long id, JobRequest jobUpdateRequest, Long accountId) throws CrudException;

    boolean deleteJob(Long id, Long accountId) throws JobNotExistedException;

    Job createJob(JobCreateRequest jobCreateRequest, Long accountId) throws CrudException;
}
