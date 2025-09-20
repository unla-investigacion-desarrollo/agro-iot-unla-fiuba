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
    private Double taValue;
    private Double hrValue;
    private Double hsValue;
    private Boolean rainForecast;
    private Boolean irrigation;
    private boolean isCurrentReading;
}
