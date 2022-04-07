package com.fptu.ojt.mappers;

import com.fptu.ojt.common.payload.dto.EvaluationDTO;
import com.fptu.ojt.data.entities.Evaluation;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface EvaluationMapper {
    EvaluationDTO evaluationToEvaluationDTO(Evaluation evaluation);

}
