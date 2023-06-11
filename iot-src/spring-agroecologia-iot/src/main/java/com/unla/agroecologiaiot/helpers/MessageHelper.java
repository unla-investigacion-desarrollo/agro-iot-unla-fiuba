package com.unla.agroecologiaiot.helpers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.unla.agroecologiaiot.helpers.HttpHelper.Http;
import com.unla.agroecologiaiot.helpers.JsonParse.JsonParser;

public class MessageHelper {

    public static final String E01 = "Ups! Algo salió mal";
    public static final String E02 = "Error de búsqueda";
    public static final String E03 = "Error de validación";
    public static final String E04 = "Operación Exitosa";

    public static class Message {

        public static ResponseEntity<String> ErrorException(Exception ex) {
            var responseMessage = E01;
            responseMessage += !ex.getMessage().isEmpty() ? ". Exception Message: " + ex.getLocalizedMessage() : "";
            return new ResponseEntity<String>(JsonParser.toJson(responseMessage),
                    Http.getContentType_Json(),
                    HttpStatus.BAD_REQUEST);
        }

        public static ResponseEntity<String> ErrorSearchEntity() {
            return new ResponseEntity<String>(JsonParser.toJson(E02), Http.getContentType_Json(),
                    HttpStatus.BAD_REQUEST);
        }

        public static ResponseEntity<String> ErrorSearchEntity(String message) {
            return new ResponseEntity<String>(JsonParser.toJson(message), Http.getContentType_Json(),
                    HttpStatus.BAD_REQUEST);
        }

        public static ResponseEntity<String> ErrorValidation() {
            return new ResponseEntity<String>(JsonParser.toJson(E03), Http.getContentType_Json(),
                    HttpStatus.BAD_REQUEST);
        }

        public static ResponseEntity<String> Ok(Object obj) {
            return new ResponseEntity<String>(JsonParser.toJson(obj), Http.getContentType_Json(), HttpStatus.OK);
        }

        public static ResponseEntity<String> Ok() {
            return new ResponseEntity<String>(JsonParser.toJson(E04), Http.getContentType_Json(), HttpStatus.OK);
        }
    }
}
