package com.fptu.ojt.data.repositories;

import com.fptu.ojt.data.entities.Company;
import com.fptu.ojt.data.entities.Representative;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RepresentativeRepository extends JpaRepository<Representative, Long> {
    Representative findByCompany(Company company);
}
