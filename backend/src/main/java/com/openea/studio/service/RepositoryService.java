package com.openea.studio.service;

import com.openea.studio.dto.*;
import com.openea.studio.repository.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RepositoryService {
    private final ApplicationRepository applicationRepository;
    private final IntegrationRepository integrationRepository;
    private final BusinessCapabilityRepository capabilityRepository;
    private final TechnologyItemRepository technologyRepository;
    private final RoadmapItemRepository roadmapRepository;

    public ArchitectureRepositoryDto getRepository() {
        return new ArchitectureRepositoryDto(
                applicationRepository.findAll().stream().map(Mapper::toDto).toList(),
                integrationRepository.findAll().stream().map(Mapper::toDto).toList(),
                capabilityRepository.findAll().stream().map(Mapper::toDto).toList(),
                technologyRepository.findAll().stream().map(Mapper::toDto).toList(),
                roadmapRepository.findAll().stream().map(Mapper::toDto).toList()
        );
    }

    @Transactional
    public ArchitectureRepositoryDto replaceRepository(ArchitectureRepositoryDto dto) {
        integrationRepository.deleteAll();
        applicationRepository.deleteAll();
        capabilityRepository.deleteAll();
        technologyRepository.deleteAll();
        roadmapRepository.deleteAll();

        applicationRepository.saveAll(dto.applications().stream().map(Mapper::toEntity).toList());
        integrationRepository.saveAll(dto.integrations().stream().map(Mapper::toEntity).toList());
        capabilityRepository.saveAll(dto.capabilities().stream().map(Mapper::toEntity).toList());
        technologyRepository.saveAll(dto.technologies().stream().map(Mapper::toEntity).toList());
        roadmapRepository.saveAll(dto.roadmap().stream().map(Mapper::toEntity).toList());
        return getRepository();
    }
}
