package com.openea.studio.repository;

import com.openea.studio.model.IntegrationEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface IntegrationRepository extends JpaRepository<IntegrationEntity, String> {
    List<IntegrationEntity> findBySourceIdOrTargetId(String sourceId, String targetId);
    void deleteBySourceIdOrTargetId(String sourceId, String targetId);
}
