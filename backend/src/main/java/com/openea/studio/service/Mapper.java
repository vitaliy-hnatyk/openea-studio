package com.openea.studio.service;

import com.openea.studio.dto.*;
import com.openea.studio.model.*;

import java.math.BigDecimal;
import java.util.ArrayList;

public final class Mapper {
    private Mapper() {
    }

    public static ApplicationDto toDto(ApplicationEntity entity) {
        return new ApplicationDto(
                entity.getId(),
                entity.getName(),
                entity.getDomain(),
                entity.getDescription(),
                entity.getOwner(),
                entity.getStatus(),
                entity.getCriticality(),
                entity.getTechnologies(),
                entity.getAnnualCost(),
                entity.getLifecycle(),
                new PositionDto(entity.getPositionX() == null ? 0 : entity.getPositionX(), entity.getPositionY() == null ? 0 : entity.getPositionY())
        );
    }

    public static ApplicationEntity toEntity(ApplicationDto dto) {
        ApplicationEntity entity = new ApplicationEntity();
        entity.setId(dto.id());
        entity.setName(dto.name());
        entity.setDomain(dto.domain());
        entity.setDescription(dto.description());
        entity.setOwner(dto.owner());
        entity.setStatus(dto.status());
        entity.setCriticality(dto.criticality());
        entity.setTechnologies(dto.technologies() == null ? new ArrayList<>() : new ArrayList<>(dto.technologies()));
        entity.setAnnualCost(dto.annualCost() == null ? BigDecimal.ZERO : dto.annualCost());
        entity.setLifecycle(dto.lifecycle());
        if (dto.position() != null) {
            entity.setPositionX(dto.position().x());
            entity.setPositionY(dto.position().y());
        }
        return entity;
    }

    public static IntegrationDto toDto(IntegrationEntity entity) {
        return new IntegrationDto(entity.getId(), entity.getSourceId(), entity.getTargetId(), entity.getType(), entity.getLabel(), entity.getCriticality());
    }

    public static IntegrationEntity toEntity(IntegrationDto dto) {
        IntegrationEntity entity = new IntegrationEntity();
        entity.setId(dto.id());
        entity.setSourceId(dto.sourceId());
        entity.setTargetId(dto.targetId());
        entity.setType(dto.type());
        entity.setLabel(dto.label());
        entity.setCriticality(dto.criticality());
        return entity;
    }

    public static BusinessCapabilityDto toDto(BusinessCapabilityEntity entity) {
        return new BusinessCapabilityDto(entity.getId(), entity.getName(), entity.getDomain(), entity.getOwner(), entity.getDescription(), entity.getParentId());
    }

    public static BusinessCapabilityEntity toEntity(BusinessCapabilityDto dto) {
        BusinessCapabilityEntity entity = new BusinessCapabilityEntity();
        entity.setId(dto.id());
        entity.setName(dto.name());
        entity.setDomain(dto.domain());
        entity.setOwner(dto.owner());
        entity.setDescription(dto.description());
        entity.setParentId(dto.parentId());
        return entity;
    }

    public static TechnologyItemDto toDto(TechnologyItemEntity entity) {
        return new TechnologyItemDto(entity.getId(), entity.getName(), entity.getCategory(), entity.getOwner(), entity.getLifecycle(), entity.getDescription());
    }

    public static TechnologyItemEntity toEntity(TechnologyItemDto dto) {
        TechnologyItemEntity entity = new TechnologyItemEntity();
        entity.setId(dto.id());
        entity.setName(dto.name());
        entity.setCategory(dto.category());
        entity.setOwner(dto.owner());
        entity.setLifecycle(dto.lifecycle());
        entity.setDescription(dto.description());
        return entity;
    }

    public static RoadmapItemDto toDto(RoadmapItemEntity entity) {
        return new RoadmapItemDto(entity.getId(), entity.getTitle(), entity.getDue(), entity.getStatus());
    }

    public static RoadmapItemEntity toEntity(RoadmapItemDto dto) {
        RoadmapItemEntity entity = new RoadmapItemEntity();
        entity.setId(dto.id());
        entity.setTitle(dto.title());
        entity.setDue(dto.due());
        entity.setStatus(dto.status());
        return entity;
    }
}
