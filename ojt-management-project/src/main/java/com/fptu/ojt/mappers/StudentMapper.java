package com.fptu.ojt.mappers;

import com.fptu.ojt.common.payload.dto.StudentDTO;
import com.fptu.ojt.data.entities.Student;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface StudentMapper {
    @Mapping(source = "semester", target = "semester")
    StudentDTO studentToStudentDTO(Student student);
}
