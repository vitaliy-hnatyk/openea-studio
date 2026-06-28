package com.openea.studio.dto;

public record IntegrationDto(
        String id,
        String sourceId,
        String targetId,
        String type,
        String label,
        String criticality
) {
}
