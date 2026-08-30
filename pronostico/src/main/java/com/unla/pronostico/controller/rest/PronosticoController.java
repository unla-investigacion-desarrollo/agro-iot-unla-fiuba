package com.unla.pronostico.controller.rest;

import java.io.IOException;
import java.time.LocalDateTime;

import org.opengis.referencing.FactoryException;
import org.opengis.referencing.operation.TransformException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.unla.pronostico.model.service.PronosticoService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/pronostico")
@Tag(name = "Pronóstico", description = "Operaciones relacionadas con el pronóstico de lluvia")
public class PronosticoController {

    private static final Logger logger = LoggerFactory.getLogger(PronosticoController.class);

    @Autowired
    private PronosticoService pronosticoService;
  
    //http://localhost:8080/pronostico/lluviaProxHora
    @Operation(
        summary = "Consulta si va a llover en la próxima hora",
        description = "Devuelve true o false según si se espera lluvia en la próxima hora para la ubicación configurada."
    )
    @ApiResponse(responseCode = "200", description = "Resultado obtenido correctamente")
    @ApiResponse(responseCode = "500", description = "Error interno al procesar la solicitud", content = @Content(schema = @Schema(type = "string")))
    @GetMapping("/lluviaProxHora")
    public ResponseEntity<Boolean> getAll(
                @Parameter(
                    description = "Nombre de la localidad",
                    example = "Lanus",
                    required = true
                )
                @RequestParam String localidad,
                
                @Parameter(
                    description = "Fecha y hora en formato ISO-8601 (opcional)",
                    example = "2025-05-17T10:30:00",
                    required = false
                )
                @RequestParam(required = false)
                @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
                LocalDateTime fechaHora
            ) {
        try {
            return ResponseEntity.ok(pronosticoService.lluviaProx(localidad, fechaHora));
        } catch (IOException e) {
            logger.error("IOException al procesar lluviaProxHora", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body(false);
        } catch (FactoryException e) {
            logger.error("FactoryException al procesar lluviaProxHora", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                 .body(false);
        } catch (TransformException e) { //Errores de transformación de coordenadas
            logger.error("Errores de transformación de coordenadas: ", e);
            return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY)
                                 .body(false);
        }
    }
}
