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
@Table(name = "roadmap_items")
public class RoadmapItemEntity {
    @Id
    private String id;

    @Column(nullable = false)
    private String title;

    private String due;
    private String status;
}
