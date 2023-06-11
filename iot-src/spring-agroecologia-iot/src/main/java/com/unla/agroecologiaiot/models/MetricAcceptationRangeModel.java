package com.unla.agroecologiaiot.models;

import java.util.Date;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class MetricAcceptationRangeModel {

    private long metricAcceptationRangeId;

    private String name;
    private double startValue;
    private double endValue;
    private String metricTypeCode;

    private Date createdAt;
    private String metricTypeDescription;
}