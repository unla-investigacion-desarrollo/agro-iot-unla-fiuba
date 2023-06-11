package com.unla.agroecologiaiot.entities;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import java.util.Set;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Entity
public class MetricType {

    @Id
    private String code;
    private String description;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "metricType")
    private Set<MetricReading> metricReadings;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "metricType")
    private Set<MetricAcceptationRange> metricAcceptationRanges;
}
