package com.unla.agroecologiaiot.models;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class SectorMetricRangeModel {

    private String name;
    private String description;
    private double taStartValue;
    private double taEndValue;
    private double hrStartValue;
    private double hrEndValue;
    private double hsStartValue;
    private double hsEndValue;
    private String metricTypeCode;
}