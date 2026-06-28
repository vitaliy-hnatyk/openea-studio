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
@Table(name = "technology_items")
public class TechnologyItemEntity {
    @Id
    private String id;

    @Column(nullable = false)
    private String name;

    private String category;
    private String owner;
    private String lifecycle;

    @Column(length = 4000)
    private String description;
}
