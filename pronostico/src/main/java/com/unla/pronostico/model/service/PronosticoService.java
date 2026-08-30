package com.unla.pronostico.model.service;

import java.io.IOException;
import java.time.LocalDateTime;

import org.opengis.referencing.FactoryException;
import org.opengis.referencing.operation.TransformException;
import org.springframework.stereotype.Service;

@Service
public interface PronosticoService {

    public Boolean lluviaProx(String localidad, LocalDateTime fechaHora) throws IOException, FactoryException, TransformException;

}
