package com.unla.pronostico.model.service.impl;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;

import org.geotools.referencing.CRS;
import org.opengis.referencing.FactoryException;
import org.opengis.referencing.crs.CoordinateReferenceSystem;
import org.opengis.referencing.operation.MathTransform;
import org.opengis.referencing.operation.TransformException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.unla.pronostico.model.dto.Centroide;
import com.unla.pronostico.model.dto.properties.AwsProperty;
import com.unla.pronostico.model.service.GeorefService;
import com.unla.pronostico.model.service.PronosticoService;

import io.swagger.v3.oas.annotations.Hidden;
import ucar.ma2.Array;
import ucar.ma2.Index;
import ucar.nc2.NetcdfFile;
import ucar.nc2.NetcdfFiles;
import ucar.nc2.Variable;

@Service
public class PronosticoServiceImpl implements PronosticoService{

    private static final Logger logger = LoggerFactory.getLogger(PronosticoServiceImpl.class);

    @Autowired
    private AwsProperty awsProperty;
    @Hidden
    @Autowired
    private GeorefService georefService;

    @Override
    public Boolean lluviaProx(String localidad, LocalDateTime fechaHora) throws IOException, FactoryException, TransformException {
        logger.info("Request: localidad="+localidad);
        Centroide centroide = georefService.localidadCentroide(localidad);        
        return ClasificarLluvia(buscarValorPrecipitacionLambert(calcularArchivoNetCDFPorHoraActual(fechaHora),centroide));
    }

    public String calcularArchivoNetCDFPorHoraActual(LocalDateTime fechaHora) {
        logger.info("FechaHora recibida: {}", fechaHora);
        LocalDateTime referencia = (fechaHora != null)? fechaHora : LocalDateTime.now(ZoneId.of("America/Argentina/Buenos_Aires"));
        // Si ya pasaron las 00:00hs y estamos entre 00–17, usamos fecha del día anterior
        LocalDate fechaBase = referencia.getHour() < 18 ? referencia.minusDays(1).toLocalDate() : referencia.toLocalDate();
        int horaActual = referencia.getHour();
    
        // Calcular índice del archivo (006–030)
        int indice = (horaActual >= 18 ? horaActual - 12 : horaActual + 12);
        
        String fechaArchivo = fechaBase.format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        String numeroArchivo = String.format("%03d", indice);
    
        String nombreArchivo = "WRFDETAR_01H_" + fechaArchivo + "_12_" + numeroArchivo + ".nc";
        String rutaCompleta = awsProperty.getSaveDir() + nombreArchivo;
    
        logger.info("🕒 Archivo correspondiente a la hora actual: " + nombreArchivo);
        return rutaCompleta;
    }
    
    public double buscarValorPrecipitacionLambert(String filePath, Centroide cen) throws IOException, FactoryException, TransformException {
        double latObjetivo = cen.getLat();
        double lonObjetivo = cen.getLon();
    
        try (NetcdfFile archivoNC = NetcdfFiles.open(filePath)) {
            // 1. Leer variables necesarias
            Variable varPP = archivoNC.findVariable("PP");
            Variable varX = archivoNC.findVariable("x"); // coordenadas en metros
            Variable varY = archivoNC.findVariable("y");
    
            Array xVals = varX.read(); // longitud: 999
            Array yVals = varY.read(); // latitud: 1249
    
            // 2. Leer parámetros de la proyección desde la variable "Lambert_Conformal"
            Variable lambert = archivoNC.findVariable("Lambert_Conformal");
            if (lambert == null) {
                throw new IOException("Variable 'Lambert_Conformal' no encontrada en el archivo NetCDF.");
            }
    
            double lon0 = lambert.findAttribute("longitude_of_central_meridian").getNumericValue().doubleValue();
            double lat0 = lambert.findAttribute("latitude_of_projection_origin").getNumericValue().doubleValue();
    
            Array stdParallels = lambert.findAttribute("standard_parallel").getValues();
            double sp1 = stdParallels.getFloat(0);
            double sp2 = stdParallels.getSize() > 1 ? stdParallels.getFloat(1) : sp1;
    
            // 3. Definir CRS de origen (lat/lon) y destino (Lambert Conformal)
            System.setProperty("org.geotools.referencing.forceXY", "true");
            CoordinateReferenceSystem crsGeografico = CRS.decode("EPSG:4326", true); // WGS84
            String lambertWKT = String.format(
                "PROJCS[\"Lambert_Conformal_Conic\"," +
                "GEOGCS[\"WGS 84\", DATUM[\"WGS_1984\", SPHEROID[\"WGS 84\", 6370000.0, 0.0]]," +
                "PRIMEM[\"Greenwich\", 0.0], UNIT[\"degree\", 0.017453292519943295]]," +
                "PROJECTION[\"Lambert_Conformal_Conic\"]," +
                "PARAMETER[\"standard_parallel_1\", %.6f]," +
                "PARAMETER[\"standard_parallel_2\", %.6f]," +
                "PARAMETER[\"latitude_of_origin\", %.6f]," +
                "PARAMETER[\"central_meridian\", %.6f]," +
                "UNIT[\"metre\", 1.0]]",
                sp1, sp2, lat0, lon0
            );
    
            CoordinateReferenceSystem crsLambert = CRS.parseWKT(lambertWKT);
            MathTransform transform = CRS.findMathTransform(crsGeografico, crsLambert, true);
    
            // 4. Transformar lat/lon del centroide a coordenadas proyectadas
            double[] srcCoord = new double[]{lonObjetivo, latObjetivo}; // lon, lat
            double[] dstCoord = new double[2];
            transform.transform(srcCoord, 0, dstCoord, 0, 1);
    
            double xMetro = dstCoord[0];
            double yMetro = dstCoord[1];

            // 5. Encontrar el índice más cercano en x e y
            int closestX = buscarIndiceCercano(xVals, xMetro);
            int closestY = buscarIndiceCercano(yVals, yMetro);

            // 6. Leer valor de PP en esa posición
            Array ppData = varPP.read();
            Index ppIndex = ppData.getIndex();
            double valorPP = ppData.getDouble(ppIndex.set(0, closestY, closestX)); // time=0

            logger.info("📍 Centroide (lat/lon): {}, {}", latObjetivo, lonObjetivo);
            logger.info("🗺️ Lambert proyectado (m): x={}, y={}", xMetro, yMetro);
            logger.info("🔢 Índices de grilla: xIndex={}, yIndex={}", closestX, closestY);

            double xCelda = xVals.getDouble(closestX);
            double yCelda = yVals.getDouble(closestY);

            logger.info("📐 Coordenadas celda usada (m): x={}, y={}", xCelda, yCelda);
            logger.info("🌧️ Precipitación PP: {}", valorPP);

            return valorPP;
        } catch (IOException e) {
            logger.error("❌ No se encontro el archivo correspondiente a la hora actual: " + filePath);
            throw new IOException("No se encontro el archivo correspondiente a la hora actual: " + filePath);
        }
    }
    // Función auxiliar para encontrar el índice más cercano a un valor
    private int buscarIndiceCercano(Array valores, double objetivo) {
        double minDiff = Double.MAX_VALUE;
        int closestIdx = -1;
    
        for (int i = 0; i < valores.getShape()[0]; i++) {
            double val = valores.getDouble(i);
            double diff = Math.abs(val - objetivo);
            if (diff < minDiff) {
                minDiff = diff;
                closestIdx = i;
            }
        }
    
        return closestIdx;
    }

    /*
    * 🌧️ Clasificación por intensidad (en mm/hora):
    * Intensidad	        Rango en mm/h	Descripción
    * Lluvia muy débil	    < 0.5 mm/h	    Apenas perceptible
    * Lluvia débil	        0.5 – 2 mm/h	Goteo constante, pero suave
    * Lluvia moderada	    2 – 10 mm/h	    Se moja todo rápido, pero no es torrencial
    * Lluvia fuerte	        10 – 30 mm/h	Puede generar charcos y escurrimientos
    * Lluvia muy fuerte	    30 – 60 mm/h	Alta posibilidad de anegamientos
    * Lluvia torrencial	    > 60 mm/h	    Puede provocar inundaciones rápidas
    * https://www.infobae.com/salud/ciencia/2025/05/16/llovio-el-80-del-registro-habitual-para-mayo-en-el-amba-que-diferencia-a-las-tormentas-de-las-precipitaciones-intensas/
    */ 
    public Boolean ClasificarLluvia(double pp) {
        Boolean respuesta = false;
        if (pp < 0.5) {
            logger.info("No llueve o es una lluvia Muy débil de "+String.format("%.2f", pp)+"mm");
        } else if (pp < 2.0) {
            logger.info("🌧️ Lluvia débil de "+String.format("%.2f", pp)+"mm");
            respuesta = true;
        } else if (pp < 10.0) {
            logger.info("🌧️ Lluvia Moderada de "+String.format("%.2f", pp)+"mm");
            respuesta = true;
        } else if (pp < 30.0) {
            logger.info("🌧️ Lluvia Fuerte de "+String.format("%.2f", pp)+"mm");
            respuesta = true;
        } else if (pp < 60.0) {
            logger.info("🌧️ Lluvia Muy Fuerte de "+String.format("%.2f", pp)+"mm");
            respuesta = true;
        } else {
            logger.info("🌧️ Lluvia Torrencial de "+String.format("%.2f", pp)+"mm");
            respuesta = true;
        }
        logger.info("Response: "+respuesta);
        return respuesta;
    }

    /*
     * Clasificación por intensidad (en mm/hora):
     * Intensidad           Rango en mm/h	Descripción
     * Lluvia muy débil	    < 0.5 mm/h	    Apenas perceptible
     * Lluvia débil	        0.5 – 2 mm/h	Goteo constante, pero suave
     * Lluvia moderada	    2 – 10 mm/h	    Se moja todo rápido, pero no es torrencial
     * Lluvia fuerte	    10 – 30 mm/h	Puede generar charcos y escurrimientos
     * Lluvia muy fuerte	30 – 60 mm/h	Alta posibilidad de anegamientos
     * Lluvia torrencial	> 60 mm/h	    Puede provocar inundaciones rápidas
     */
    public Boolean ClasificarLluviaMM(double mmEn10Min) {
        Boolean respuesta = null;
        if (mmEn10Min < 0.08) {
            logger.info("Lluvia Muy débil de "+String.format("%.2f", mmEn10Min)+"mm");
        } else if (mmEn10Min < 0.33) {
            logger.info("Lluvia débilde "+String.format("%.2f", mmEn10Min)+"mm");
        } else if (mmEn10Min < 1.66) {
            logger.info("Lluvia Moderadade "+String.format("%.2f", mmEn10Min)+"mm");
            respuesta = true;
        } else if (mmEn10Min < 5.0) {
            logger.info("Lluvia Fuertede "+String.format("%.2f", mmEn10Min)+"mm");
            respuesta = true;
        } else if (mmEn10Min < 10.0) {
            logger.info("Lluvia Muy Fuertede "+String.format("%.2f", mmEn10Min)+"mm");
            respuesta = true;
        } else {
            logger.info("Lluvia Torrencialde "+String.format("%.2f", mmEn10Min)+"mm");
            respuesta = true;
        }
        logger.info("Response: "+respuesta);
        return respuesta;
    }
}