package com.unla.agroecologiaiot.entities;

import java.time.LocalDateTime;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.ForeignKey;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonBackReference;

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
    
    @Column(name = "ta_value")
    private Double taValue;
    @Column(name = "hr_value")
    private Double hrValue;
    @Column(name = "hs_value")
    private Double hsValue;
    @Column(name = "rain_forecast")
    private boolean rainForecast;
    @Column
    private boolean irrigation;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sectorId", nullable = false, foreignKey = @ForeignKey(name = "FK_MetricReading_Sector"))
    @JsonBackReference
    private Sector sector;

    //@ManyToOne(fetch = FetchType.LAZY)
    //@JoinColumn(name = "metricTypeId", nullable = false, foreignKey = @ForeignKey(name = "FK_MetricReading_MetricType"))
    //private MetricType metricType;
}
