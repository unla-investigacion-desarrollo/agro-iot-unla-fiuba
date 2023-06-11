package com.unla.agroecologiaiot.models;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class SectorMetricRangeModel {

    private String name;
    private double startValue;
    private double endValue;
    private String metricTypeCode;
    private String metricTypeDescription;
}