package com.openea.studio.dto;

import java.math.BigDecimal;
import java.util.List;

public record ApplicationDto(
        String id,
        String name,
        String domain,
        String description,
        String owner,
        String status,
        String criticality,
        List<String> technologies,
        BigDecimal annualCost,
        String lifecycle,
        PositionDto position
) {
}
