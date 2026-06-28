package com.openea.studio.controller;

import com.openea.studio.dto.*;
import com.openea.studio.model.*;
import com.openea.studio.repository.*;
import com.openea.studio.service.Mapper;
import com.openea.studio.service.RepositoryService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class RepositoryController {
    private final RepositoryService repositoryService;
    private final ApplicationRepository applicationRepository;
    private final IntegrationRepository integrationRepository;
    private final BusinessCapabilityRepository capabilityRepository;
    private final TechnologyItemRepository technologyRepository;

    @GetMapping("/repository")
    public ArchitectureRepositoryDto getRepository() {
        return repositoryService.getRepository();
    }

    @PutMapping("/repository")
    public ArchitectureRepositoryDto replaceRepository(@RequestBody ArchitectureRepositoryDto dto) {
        return repositoryService.replaceRepository(dto);
    }

    @GetMapping("/applications")
    public List<ApplicationDto> applications() {
        return applicationRepository.findAll().stream().map(Mapper::toDto).toList();
    }

    @PostMapping("/applications")
    public ResponseEntity<ApplicationDto> createApplication(@RequestBody ApplicationDto dto) {
        ApplicationEntity saved = applicationRepository.save(Mapper.toEntity(dto));
        return ResponseEntity.created(URI.create("/api/applications/" + saved.getId())).body(Mapper.toDto(saved));
    }

    @PutMapping("/applications/{id}")
    public ApplicationDto updateApplication(@PathVariable String id, @RequestBody ApplicationDto dto) {
        ApplicationEntity entity = Mapper.toEntity(new ApplicationDto(id, dto.name(), dto.domain(), dto.description(), dto.owner(), dto.status(), dto.criticality(), dto.technologies(), dto.annualCost(), dto.lifecycle(), dto.position()));
        return Mapper.toDto(applicationRepository.save(entity));
    }

    @Transactional
    @DeleteMapping("/applications/{id}")
    public ResponseEntity<Void> deleteApplication(@PathVariable String id) {
        integrationRepository.deleteBySourceIdOrTargetId(id, id);
        applicationRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/integrations")
    public List<IntegrationDto> integrations() {
        return integrationRepository.findAll().stream().map(Mapper::toDto).toList();
    }

    @PostMapping("/integrations")
    public ResponseEntity<IntegrationDto> createIntegration(@RequestBody IntegrationDto dto) {
        IntegrationEntity saved = integrationRepository.save(Mapper.toEntity(dto));
        return ResponseEntity.created(URI.create("/api/integrations/" + saved.getId())).body(Mapper.toDto(saved));
    }

    @PutMapping("/integrations/{id}")
    public IntegrationDto updateIntegration(@PathVariable String id, @RequestBody IntegrationDto dto) {
        IntegrationEntity entity = Mapper.toEntity(new IntegrationDto(id, dto.sourceId(), dto.targetId(), dto.type(), dto.label(), dto.criticality()));
        return Mapper.toDto(integrationRepository.save(entity));
    }

    @DeleteMapping("/integrations/{id}")
    public ResponseEntity<Void> deleteIntegration(@PathVariable String id) {
        integrationRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/capabilities")
    public List<BusinessCapabilityDto> capabilities() {
        return capabilityRepository.findAll().stream().map(Mapper::toDto).toList();
    }

    @PostMapping("/capabilities")
    public ResponseEntity<BusinessCapabilityDto> createCapability(@RequestBody BusinessCapabilityDto dto) {
        BusinessCapabilityEntity saved = capabilityRepository.save(Mapper.toEntity(dto));
        return ResponseEntity.created(URI.create("/api/capabilities/" + saved.getId())).body(Mapper.toDto(saved));
    }

    @PutMapping("/capabilities/{id}")
    public BusinessCapabilityDto updateCapability(@PathVariable String id, @RequestBody BusinessCapabilityDto dto) {
        BusinessCapabilityEntity entity = Mapper.toEntity(new BusinessCapabilityDto(id, dto.name(), dto.domain(), dto.owner(), dto.description(), dto.parentId()));
        return Mapper.toDto(capabilityRepository.save(entity));
    }

    @DeleteMapping("/capabilities/{id}")
    public ResponseEntity<Void> deleteCapability(@PathVariable String id) {
        capabilityRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/technologies")
    public List<TechnologyItemDto> technologies() {
        return technologyRepository.findAll().stream().map(Mapper::toDto).toList();
    }

    @PostMapping("/technologies")
    public ResponseEntity<TechnologyItemDto> createTechnology(@RequestBody TechnologyItemDto dto) {
        TechnologyItemEntity saved = technologyRepository.save(Mapper.toEntity(dto));
        return ResponseEntity.created(URI.create("/api/technologies/" + saved.getId())).body(Mapper.toDto(saved));
    }

    @PutMapping("/technologies/{id}")
    public TechnologyItemDto updateTechnology(@PathVariable String id, @RequestBody TechnologyItemDto dto) {
        TechnologyItemEntity entity = Mapper.toEntity(new TechnologyItemDto(id, dto.name(), dto.category(), dto.owner(), dto.lifecycle(), dto.description()));
        return Mapper.toDto(technologyRepository.save(entity));
    }

    @DeleteMapping("/technologies/{id}")
    public ResponseEntity<Void> deleteTechnology(@PathVariable String id) {
        technologyRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
