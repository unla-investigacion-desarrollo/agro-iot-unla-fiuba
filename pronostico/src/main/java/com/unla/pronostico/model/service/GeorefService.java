package com.unla.pronostico.model.service;

import com.unla.pronostico.model.dto.Centroide;
import com.unla.pronostico.model.dto.RespuestaAPI;

public interface GeorefService {

    public  RespuestaAPI localidad(String nombre) throws RuntimeException;
    public Centroide localidadCentroide(String nombre) throws RuntimeException;
    
}
