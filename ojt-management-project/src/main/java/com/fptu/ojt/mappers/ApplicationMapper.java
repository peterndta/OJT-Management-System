package com.fptu.ojt.mappers;

import com.fptu.ojt.common.payload.dto.ApplicationDTO;
import com.fptu.ojt.data.entities.Application;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ApplicationMapper {
    @Mapping(source = "student.account", target = "account")
    ApplicationDTO applicationToApplicationDTO(Application application);
}
