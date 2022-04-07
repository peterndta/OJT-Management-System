package com.fptu.ojt.mappers;


import com.fptu.ojt.common.payload.dto.MajorDTO;
import com.fptu.ojt.data.entities.Major;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface MajorMapper {
    MajorDTO majorToMajorDTO(Major major);
}
