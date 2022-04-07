package com.fptu.ojt.data.repositories;

import com.fptu.ojt.data.entities.Attachment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AttachmentRepository extends JpaRepository<Attachment, String> {

    List<Attachment> findAllByKeyIn(List<String> keys);
    Attachment findByApplicationId(Long applicationId);
}
