package com.openea.studio.dto;

public record TechnologyItemDto(
        String id,
        String name,
        String category,
        String owner,
        String lifecycle,
        String description
) {
}
