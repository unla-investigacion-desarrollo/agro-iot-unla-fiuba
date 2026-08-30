package com.unla.pronostico.controller.rest;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.unla.pronostico.model.dto.Centroide;
import com.unla.pronostico.model.dto.RespuestaAPI;
import com.unla.pronostico.model.service.GeorefService;

import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/georef")
@Tag(name = "Geo Referenciación", description = "Operaciones relacionadas con geo-referenciación")
public class GeorefController {
    
    private final GeorefService georefService;

    public GeorefController(GeorefService georefService) {
        this.georefService = georefService;
    }

    @GetMapping("/localidades")
    public RespuestaAPI obtenerLocalidades(String localidad) {
        return georefService.localidad(localidad);
    }

    @GetMapping("/localidadesCentroide")
    public Centroide obtenerLocalidadesCentroide(String localidad) {
        return georefService.localidadCentroide(localidad);
    }
}
