package com.fptu.ojt.mappers;

import com.fptu.ojt.common.payload.dto.SemesterDTO;
import com.fptu.ojt.data.entities.Semester;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface SemesterMapper {
    SemesterDTO semesterToSemesterDTO(Semester semester);
}
