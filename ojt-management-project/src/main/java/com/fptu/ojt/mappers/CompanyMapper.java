package com.fptu.ojt.mappers;

import com.fptu.ojt.common.payload.dto.CompanyDTO;
import com.fptu.ojt.data.entities.Company;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface CompanyMapper {
    CompanyDTO companyToCompanyDTO(Company company);
}
