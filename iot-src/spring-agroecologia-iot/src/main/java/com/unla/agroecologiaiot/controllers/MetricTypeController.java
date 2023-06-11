package com.unla.agroecologiaiot.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.unla.agroecologiaiot.models.MetricTypeModel;
import com.unla.agroecologiaiot.services.IMetricTypeService;

@RestController
@RequestMapping("api/v1/metric-types")
public class MetricTypeController {

    @Autowired
    @Qualifier("metricTypeService")
    private IMetricTypeService metricTypeService;

    @GetMapping("{code}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<String> get(@PathVariable String code) {
        return metricTypeService.getByCode(code);
    }

    @PutMapping("{code}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<String> put(@RequestBody MetricTypeModel metricTypeModel, @PathVariable String code) {
        return metricTypeService.put(metricTypeModel, code);
    }

    @GetMapping("all")
    @PreAuthorize("hasAuthority('ADMIN')" + " || hasAuthority('GARDEN_MANAGER')")
    public ResponseEntity<String> getAll() {
        return metricTypeService.getAll();
    }
}
