package com.fptu.ojt.mappers;

import com.fptu.ojt.common.payload.dto.JobDTO;
import com.fptu.ojt.data.entities.Job;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface JobMapper {
    JobDTO jobToJobDTO(Job job);
}
