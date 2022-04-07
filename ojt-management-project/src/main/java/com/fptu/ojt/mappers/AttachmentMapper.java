package com.fptu.ojt.mappers;

import com.fptu.ojt.common.payload.dto.AttachmentDTO;
import com.fptu.ojt.data.entities.Attachment;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface AttachmentMapper {
    AttachmentDTO attachmentToAttachmentDTO(Attachment attachment);
}
