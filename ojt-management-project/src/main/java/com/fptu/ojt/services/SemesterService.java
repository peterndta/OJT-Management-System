package com.fptu.ojt.services;

import com.fptu.ojt.common.exceptions.SemesterAlreadyExistedException;
import com.fptu.ojt.common.exceptions.SemesterDisabledException;
import com.fptu.ojt.common.exceptions.SemesterNotExistedException;
import com.fptu.ojt.common.payload.request.SemesterRequest;
import com.fptu.ojt.data.entities.Semester;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

public interface SemesterService {
    Semester getById(Long id) throws SemesterNotExistedException, SemesterDisabledException;

    Page<Semester> searchSemester(Specification<Semester> specification, Pageable pageable);

    Semester updateSemester(Long id, SemesterRequest semesterUpdateRequest)
            throws SemesterAlreadyExistedException, SemesterNotExistedException;

    boolean deleteSemester(Long id) throws SemesterNotExistedException, SemesterDisabledException;

    Semester createSemester(SemesterRequest semesterRequest) throws SemesterAlreadyExistedException;
}
