package com.unla.pronostico.controller.advice;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import com.unla.pronostico.common.exception.PronosticoException;

@ControllerAdvice
public class PronosticoAdvice {

    @ExceptionHandler(PronosticoException.class)
    public ResponseEntity<String> handleEmptyInput(PronosticoException emptyInputException){
        return new ResponseEntity<String>(emptyInputException.getErrorMessage(), emptyInputException.getErrorCode());
    }
    
}
