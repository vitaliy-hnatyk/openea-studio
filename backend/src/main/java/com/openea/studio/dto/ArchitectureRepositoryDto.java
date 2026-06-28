package com.openea.studio.dto;

import java.util.List;

public record ArchitectureRepositoryDto(
        List<ApplicationDto> applications,
        List<IntegrationDto> integrations,
        List<BusinessCapabilityDto> capabilities,
        List<TechnologyItemDto> technologies,
        List<RoadmapItemDto> roadmap
) {
}
