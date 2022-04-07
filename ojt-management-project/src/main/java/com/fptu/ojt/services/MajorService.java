package com.fptu.ojt.services;

import com.fptu.ojt.common.exceptions.MajorNameAlreadyExistedException;
import com.fptu.ojt.common.exceptions.MajorNotExistedException;
import com.fptu.ojt.common.payload.request.MajorRequest;
import com.fptu.ojt.data.entities.Major;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

import java.util.List;

public interface MajorService {
    Major getMajorById(Long id) throws MajorNotExistedException;

    Page<Major> searchMajor(Specification<Major> specification, Pageable pageable);

    Major updateMajor(Long id, MajorRequest majorRequest) throws MajorNotExistedException, MajorNameAlreadyExistedException;

    boolean deleteMajor(Long id) throws MajorNotExistedException;

    boolean deleteMajors(List<Long> ids) throws MajorNotExistedException;

    boolean recoverMajor(Long id) throws MajorNotExistedException;

    Major createMajor(String name) throws MajorNameAlreadyExistedException;
}
