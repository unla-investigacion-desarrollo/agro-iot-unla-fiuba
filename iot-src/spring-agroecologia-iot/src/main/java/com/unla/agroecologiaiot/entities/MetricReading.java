package com.unla.agroecologiaiot.entities;

import java.time.LocalDateTime;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.ForeignKey;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "metricReading")
public class MetricReading {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long metricReadingId;

    private LocalDateTime readingDate;
    private String valueType;
    private String value;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sectorId", nullable = false, foreignKey = @ForeignKey(name = "FK_MetricReading_Sector"))
    private Sector sector;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "metricTypeId", nullable = false, foreignKey = @ForeignKey(name = "FK_MetricReading_MetricType"))
    private MetricType metricType;
}
