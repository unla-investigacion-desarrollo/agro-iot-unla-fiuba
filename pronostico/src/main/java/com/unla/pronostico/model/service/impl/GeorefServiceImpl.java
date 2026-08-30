package com.unla.pronostico.model.service.impl;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.google.gson.Gson;
import com.unla.pronostico.model.dto.Centroide;
import com.unla.pronostico.model.dto.ErrorResponse;
import com.unla.pronostico.model.dto.RespuestaAPI;
import com.unla.pronostico.model.dto.request.LocalidadesRequest;
import com.unla.pronostico.model.service.GeorefService;

import io.swagger.v3.oas.annotations.tags.Tag;
import reactor.core.publisher.Mono;

@Service
@Tag(name = "Geo Referenciación", description = "Operaciones relacionadas con geo-referenciación")
public class GeorefServiceImpl implements GeorefService{

    private static final Logger logger = LoggerFactory.getLogger(GeorefServiceImpl.class);

    private final WebClient webClient;
    Gson gson = new Gson();

    public GeorefServiceImpl(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.baseUrl("https://apis.datos.gob.ar/georef/api").build();
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    @Override
    public RespuestaAPI localidad(String nombre) throws RuntimeException {
        try{
            
            LocalidadesRequest requestBody = new LocalidadesRequest(nombre);
            String req = gson.toJson(requestBody);
            logger.info("Request:"+req);
            return this.webClient.post()
                    .uri("/localidades")
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(requestBody)
                    .retrieve()
                    .onStatus(status -> status.is4xxClientError(), response -> {
                        // Maneja errores 4xx
                        return response.bodyToMono(ErrorResponse.class)
                                .flatMap(errorResponse -> {
                                    String mensajeError = obtenerMensajeDeError(errorResponse);
                                    return Mono.error(new RuntimeException("Error interno en el servicio de localidades, Error 4xx: " + mensajeError));
                                });
                    })
                    .onStatus(status -> status.is5xxServerError(), response -> {
                        // Maneja errores 5xx
                        return Mono.error(new RuntimeException("Error en servicio de localidades, Error 5xx: "+ response));
                    })
                    .bodyToMono(RespuestaAPI.class)
                    .block();
 
        } catch (Exception e) {
            throw new RuntimeException("Error inesperado servicio de localidades: " + e);
        }
    }

    private String obtenerMensajeDeError(ErrorResponse errorResponse) {
        StringBuilder mensaje = new StringBuilder();
        if (errorResponse.getErrores() != null) {
            for (List<ErrorResponse.ErrorDetalle> listaErrores : errorResponse.getErrores()) {
                for (ErrorResponse.ErrorDetalle detalle : listaErrores) {
                    mensaje.append("Código: ").append(detalle.getCodigo_interno())
                        .append(", Mensaje: ").append(detalle.getMensaje())
                        .append(", Parámetro: ").append(detalle.getNombre_parametro())
                        .append(", Ubicación: ").append(detalle.getUbicacion())
                        .append("; ");
                }
            }
        } else {
            mensaje.append("No hay detalles de error.");
        }
        return mensaje.toString();
    }

    public Centroide localidadCentroide(String nombre) throws RuntimeException {
        RespuestaAPI res = this.localidad(nombre);
        logger.info("Respuesta completa: " + gson.toJson(res));
        Centroide cen = res.getResultados().get(0).getLocalidades().get(0).getCentroide();
        logger.info("Latitud: " + cen.getLat());
        logger.info("Longitud: " + cen.getLon());
        return cen;
    }
}
