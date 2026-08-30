package com.unla.pronostico.model.dto.request;

import java.util.ArrayList;
import java.util.List;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Getter
@Setter
public class LocalidadesRequest {

    private List<Localidad> localidades;

    public LocalidadesRequest(String nombre){
        this.localidades = new ArrayList<>();
        this.localidades.add(new Localidad(nombre));
    }

    @NoArgsConstructor
    @Getter
    @Setter
    public static class Localidad {

        private String id;
        private String nombre;
        private String provincia;
        private String departamento;
        private String municipio;
        private String localidad_censal;
        private String orden;
        private Boolean aplanar;
        private String campos;
        private Integer max;
        private Integer inicio;
        private Boolean exacto;

        public Localidad(String nombre) {
            this.nombre = nombre;
        }
    }
}
