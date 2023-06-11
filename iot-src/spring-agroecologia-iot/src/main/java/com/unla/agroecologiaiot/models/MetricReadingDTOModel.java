package com.unla.agroecologiaiot.models;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class MetricReadingDTOModel {
    
    private long metricReadingId;
    private String readingDate;
    private String value;
    private String valueType;
    private String metricTypeCode;
    private String metricTypeDescription;
    private boolean isCurrentReading;
}
