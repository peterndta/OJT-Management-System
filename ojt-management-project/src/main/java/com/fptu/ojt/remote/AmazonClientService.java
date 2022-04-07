package com.fptu.ojt.remote;

import com.amazonaws.services.s3.model.S3Object;
import com.fptu.ojt.data.entities.Attachment;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface AmazonClientService {
    List<Attachment> uploadFile(List<MultipartFile> multipartFile, Long accountId);
    S3Object downloadFile(String key);
}
