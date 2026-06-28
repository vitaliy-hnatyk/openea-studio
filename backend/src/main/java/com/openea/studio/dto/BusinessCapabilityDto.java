package com.openea.studio.dto;

public record BusinessCapabilityDto(
        String id,
        String name,
        String domain,
        String owner,
        String description,
        String parentId
) {
}
