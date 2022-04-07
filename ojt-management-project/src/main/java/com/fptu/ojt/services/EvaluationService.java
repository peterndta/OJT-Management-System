package com.fptu.ojt.services;

import com.fptu.ojt.common.exceptions.AccountIdNotExistedException;
import com.fptu.ojt.common.exceptions.CrudException;
import com.fptu.ojt.common.exceptions.EvaluationIdNotExistedException;
import com.fptu.ojt.common.exceptions.NotPermissionException;
import com.fptu.ojt.common.payload.request.EvaluationCreateRequest;
import com.fptu.ojt.common.payload.request.EvaluationUpdateRequest;
import com.fptu.ojt.data.entities.Evaluation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;

public interface EvaluationService {
    Evaluation getEvaluationById(Long id, Long accountId)
            throws EvaluationIdNotExistedException, AccountIdNotExistedException;

    Page<Evaluation> searchEvaluation(Specification<Evaluation> specification, Pageable pageable);

    Evaluation updateEvaluation(Long id, EvaluationUpdateRequest evaluationUpdateRequest, Long accountId)
            throws EvaluationIdNotExistedException;

    Evaluation createEvaluation(EvaluationCreateRequest evaluationCreateRequest, Long accountId)
            throws NotPermissionException;

    int importEvaluation(MultipartFile file) throws CrudException;

    ByteArrayInputStream getOnJobStudentList(Long companyId);
}
