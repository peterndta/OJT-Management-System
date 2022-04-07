package com.fptu.ojt.services;

import com.fptu.ojt.common.exceptions.MajorNameAlreadyExistedException;
import com.fptu.ojt.common.exceptions.MajorNotExistedException;
import com.fptu.ojt.common.payload.request.MajorRequest;
import com.fptu.ojt.data.entities.Major;
import com.fptu.ojt.data.repositories.MajorRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class MajorServiceImpl implements MajorService {

    private final MajorRepository majorRepository;

    public MajorServiceImpl(MajorRepository majorRepository) {
        this.majorRepository = majorRepository;
    }

    @Override
    public Major getMajorById(Long id) throws MajorNotExistedException {
        if (Boolean.FALSE.equals(majorRepository.existsById(id))) {
            throw new MajorNotExistedException();
        } else
            return majorRepository.getById(id);
    }

    @Override
    public Page<Major> searchMajor(Specification<Major> specification, Pageable pageable) {
        return majorRepository.findAll(specification, pageable);
    }

    @Override
    public Major updateMajor(Long id, MajorRequest majorRequest) throws MajorNotExistedException, MajorNameAlreadyExistedException {
        if (Boolean.FALSE.equals(majorRepository.existsById(id))) {
            throw new MajorNotExistedException();
        } else if (Boolean.TRUE.equals(majorRepository.existsByName(majorRequest.getName()))) {
            throw new MajorNameAlreadyExistedException();
        } else {
            Major major = majorRepository.getById(id);
            if (major.isDisabled()) {
                throw new MajorNotExistedException();
            } else {
                major.setName(majorRequest.getName());
                return majorRepository.save(major);
            }
        }
    }

    @Override
    public boolean deleteMajor(Long id) throws MajorNotExistedException {
        if (Boolean.FALSE.equals(majorRepository.existsById(id))) {
            throw new MajorNotExistedException();
        } else {
            Major major = majorRepository.getById(id);
            if (!major.isDisabled()) {
                major.setDisabled(true);
                majorRepository.save(major);
            }
            return true;
        }
    }

    @Override
    public boolean deleteMajors(List<Long> ids) throws MajorNotExistedException {
        if (CollectionUtils.isEmpty(ids)) return true;
        List<Major> majors = majorRepository.findAllByIdIn(ids);
        Set<Long> idSet = majors.stream().map(Major::getId).collect(Collectors.toSet());
        Set<Long> nonExistedIdSet = ids.stream().filter(id -> !idSet.contains(id)).collect(Collectors.toSet());
        if (nonExistedIdSet.size() > 0) {
            throw new MajorNotExistedException(nonExistedIdSet);
        } else {
            majors.forEach(major -> major.setDisabled(true));
            majorRepository.saveAll(majors);
        }
        return true;
    }

    @Override
    public boolean recoverMajor(Long id) throws MajorNotExistedException {
        if (Boolean.FALSE.equals(majorRepository.existsById(id))) {
            throw new MajorNotExistedException();
        } else {
            Major major = majorRepository.getById(id);
            if (major.isDisabled()) {
                major.setDisabled(false);
                majorRepository.save(major);
            }
            return true;
        }
    }

    @Override
    public Major createMajor(String name) throws MajorNameAlreadyExistedException {
        if (Boolean.TRUE.equals(majorRepository.existsByName(name))) {
            throw new MajorNameAlreadyExistedException();
        } else {
            Major major = new Major(name);
            majorRepository.save(major);
            return majorRepository.getById(major.getId());
        }
    }
}
