package com.unla.pronostico.model.dto;

import java.util.List;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Getter
@Setter
public class ErrorResponse {

    private List<List<ErrorDetalle>> errores;

    @NoArgsConstructor
    @Getter
    @Setter
    public static class ErrorDetalle {
        private String codigo_interno;
        private String mensaje;
        private String nombre_parametro;
        private String ubicacion;
    }

}
