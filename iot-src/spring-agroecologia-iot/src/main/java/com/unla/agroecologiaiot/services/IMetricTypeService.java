package com.unla.agroecologiaiot.services;

import org.springframework.http.ResponseEntity;

import com.unla.agroecologiaiot.models.MetricTypeModel;

public interface IMetricTypeService {

    public ResponseEntity<String> getByCode(String code);

    public ResponseEntity<String> getAll();

    public ResponseEntity<String> put(MetricTypeModel metricTypeModel, String code);
}
