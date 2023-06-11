package com.unla.agroecologiaiot.models;

import java.util.List;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class SectorMetricDataModel {
    
    private long sectorId;
    private String name;
    private List<MetricReadingDTOModel> readings;
}
