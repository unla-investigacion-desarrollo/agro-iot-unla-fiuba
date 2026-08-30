package com.unla.pronostico.model.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Getter
@Setter
public class Localidad  {

    private String categoria;
    private Centroide centroide;
    private Departamento departamento;
    private String id;
    private LocalidadCensal localidad_censal;
    private Municipio municipio;
    private String nombre;
    private Provincia provincia;

}
