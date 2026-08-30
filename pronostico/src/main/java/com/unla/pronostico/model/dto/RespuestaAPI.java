package com.unla.pronostico.model.dto;

import java.util.List;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Getter
@Setter
public class RespuestaAPI {
    private List<Resultados> resultados;

    @NoArgsConstructor
    @Getter
    @Setter
    public static class Resultados {
        private Integer cantidad;
        private Integer inicio;
        private List<Localidad> localidades;
        private Parametros parametros;
        private int total;
    }
}
