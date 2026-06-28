package com.openea.studio.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "integrations")
public class IntegrationEntity {
    @Id
    private String id;

    @Column(nullable = false)
    private String sourceId;

    @Column(nullable = false)
    private String targetId;

    private String type;
    private String label;
    private String criticality;
}
