package com.unla.agroecologiaiot.models;

import java.util.List;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class MetricReadingModel {
    
    private String token;
    private List<ReadingModel> readings;
}
