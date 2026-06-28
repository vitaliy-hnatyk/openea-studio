package com.openea.studio.repository;

import com.openea.studio.model.RoadmapItemEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoadmapItemRepository extends JpaRepository<RoadmapItemEntity, String> {
}
