package com.fptu.ojt.remote;

import com.amazonaws.auth.AWSCredentials;
import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.amazonaws.services.s3.model.S3Object;
import com.fptu.ojt.data.entities.Attachment;
import com.fptu.ojt.data.repositories.AttachmentRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.annotation.PostConstruct;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.UUID;

@Service
public class AmazonClientServiceImpl implements AmazonClientService {
    private AmazonS3 s3client;

    @Value("${amazon.properties.bucketName}")
    private String bucketName;
    @Value("${amazon.properties.accessKey}")
    private String accessKey;
    @Value("${amazon.properties.secretKey}")
    private String secretKey;

    private final AttachmentRepository attachmentRepository;

    public AmazonClientServiceImpl(AttachmentRepository attachmentRepository) {
        this.attachmentRepository = attachmentRepository;
    }

    @PostConstruct
    private void initializeAmazon() {
        AWSCredentials credentials = new BasicAWSCredentials(this.accessKey, this.secretKey);
        this.s3client = AmazonS3ClientBuilder.standard().withCredentials(new AWSStaticCredentialsProvider(credentials))
                .withRegion("ap-southeast-1").build();
    }

    private void uploadFileTos3bucket(String fileName, MultipartFile file, String key, Long accountId) throws IOException {
        ObjectMetadata metadata = new ObjectMetadata();
        metadata.addUserMetadata("fileName", fileName);
        metadata.addUserMetadata("contentType", file.getContentType());
        metadata.addUserMetadata("accountId", accountId.toString());
        s3client.putObject(new PutObjectRequest(bucketName, key, file.getInputStream(), metadata));
    }

//    private File convertMultiPartToFile(MultipartFile file) throws IOException {
//        File convFile = new File(file.getOriginalFilename());
//        FileOutputStream fos = new FileOutputStream(convFile);
//        fos.write(file.getBytes());
//        fos.close();
//        return convFile;
//    }

    private String generateFileName(MultipartFile multiPart) {
        return new Date().getTime() + "-" + multiPart.getOriginalFilename().replace(" ", "_");
    }

    @Override
    public List<Attachment> uploadFile(List<MultipartFile> multipartFiles, Long accountId) {
        List<Attachment> attachments = new ArrayList<>();
        for (MultipartFile multipartFile : multipartFiles) {
            String fileName = generateFileName(multipartFile);
            String key = UUID.randomUUID().toString();
            while (attachmentRepository.existsById(key)) {
                key = UUID.randomUUID().toString();
            }
            try {
                uploadFileTos3bucket(fileName, multipartFile, key, accountId);
            } catch (Exception e) {
                e.printStackTrace();
                return null;
            }
            Attachment attachment = new Attachment(key, fileName, accountId);
            attachments.add(attachment);
        }
        return attachmentRepository.saveAll(attachments);
    }

    @Override
    public S3Object downloadFile(String key) {
        S3Object object = s3client.getObject(bucketName, key);
        return object;
    }
}
