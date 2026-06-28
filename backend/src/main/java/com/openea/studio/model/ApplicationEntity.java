package com.openea.studio.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "applications")
public class ApplicationEntity {
    @Id
    private String id;

    @Column(nullable = false)
    private String name;

    private String domain;

    @Column(length = 4000)
    private String description;

    private String owner;
    private String status;
    private String criticality;
    private BigDecimal annualCost = BigDecimal.ZERO;
    private String lifecycle;
    private Double positionX;
    private Double positionY;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "application_technologies", joinColumns = @JoinColumn(name = "application_id"))
    @Column(name = "technology")
    private List<String> technologies = new ArrayList<>();
}
