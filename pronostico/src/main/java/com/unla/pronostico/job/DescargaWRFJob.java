package com.unla.pronostico.job;

import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.URL;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.atomic.AtomicInteger;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.unla.pronostico.model.dto.properties.AwsProperty;

import io.swagger.v3.oas.annotations.tags.Tag;

@Component
@RestController
@RequestMapping("/tareas")
@Tag(name = "Procesos", description = "Procesos croneados para la operativa del aplicativo")
public class DescargaWRFJob {

    private static final Logger logger = LoggerFactory.getLogger(DescargaWRFJob.class);

    @Autowired
    private AwsProperty awsProperty;

    // Executor con 10 hilos máximo
    private final ExecutorService executor = Executors.newFixedThreadPool(10);
    // Configuración de reintentos
    private static final int MAX_REINTENTOS = 3;
    private static final int RETARDO_ENTRE_INTENTOS_MS = 3000;

    private final Map<String, String> archivosFallidos = new ConcurrentHashMap<>();
    private final Map<String, String> fallidosPendientes = new ConcurrentHashMap<>();
    private final AtomicInteger exitosas = new AtomicInteger(0);
    private final AtomicInteger fallidas = new AtomicInteger(0);

    private LocalDateTime ultimaEjecucion;

    @GetMapping("/descargarManual")
    public String ejecutarDescargaManual() {
        logger.info("🚀 Ejecutando descarga manual...");
        descargarArchivosManual();
        ultimaEjecucion = LocalDateTime.now();
        logger.info("✅ Descarga manual finalizada.");
        return "Descarga manual iniciada correctamente a las " + ultimaEjecucion;
    }

    @Scheduled(cron = "0 0 18 * * *") // A las 18:00hs todos los días
    public void descargaDiaria() {
        logger.info("Iniciando descarga diaria...");
        borrarArchivos(24, 30, false);
        descargarArchivosDelDia();
        ultimaEjecucion = LocalDateTime.now();
        logger.info("Finalizo descarga diaria...");
    }

    @Scheduled(cron = "0 0 0,6,12 * * *") // Corre a las 00:00hs, 06:00hs y 12:00hs todos los días
    public void borrarArchivosPorRangoHorario() {
        logger.info("Iniciando borrado periodico...");
        LocalDateTime ahora = LocalDateTime.now(ZoneId.of("America/Argentina/Buenos_Aires"));
        int hora = ahora.getHour();
        int inicio;
        int fin;
        Boolean mismoDia = false;
        // problema con el proceso cuando es 23:59:59 o 05:59:59 y 11:59:59
        if (hora == 24 || hora == 23) {
            inicio = 6;
            fin = 11;
            mismoDia = true;
        } else if (hora == 6 || hora == 5) {
            inicio = 12;
            fin = 17;
        } else if (hora == 12 || hora == 11) {
            inicio = 18;
            fin = 23;
        } else {
            logger.error("Hora no válida para el borrado programado.");
            return;
        }

        borrarArchivos(inicio, fin, mismoDia);
        logger.info("Finalizo borrado periodico...");
    }

    @Scheduled(cron = "0 30 * * * *") // Cada hora a los 30 minutos
    public void reintentarFallidas() {
        if (archivosFallidos.isEmpty()) {
            return;
        }
        logger.info("🔁 Reintentando archivos fallidos...");

        List<CompletableFuture<Void>> futuros = archivosFallidos.entrySet().stream()
            .map(entry -> CompletableFuture.runAsync(() -> {
                String fileURL = entry.getKey();
                String fileName = entry.getValue();

                boolean exito = descargaConReintento(fileURL, fileName);
                if (!exito) {
                    fallidosPendientes.put(fileURL, fileName);
                    logger.error("❌ No se pudo descargar " + fileName + " luego de " + MAX_REINTENTOS + " intentos.");
                }
            }, executor))
            .toList();

        CompletableFuture.allOf(futuros.toArray(new CompletableFuture[0])).join();
        archivosFallidos.clear();
        archivosFallidos.putAll(fallidosPendientes);

        logger.info("🔁 Reintento completo. Fallidos restantes: " + archivosFallidos.size());
    }

    public void descargarArchivosDelDia() {
        String baseURL = awsProperty.getRepo();

        LocalDate hoy = ZonedDateTime.now(ZoneId.of("America/Argentina/Buenos_Aires")).toLocalDate();
        DateTimeFormatter pathFormatter = DateTimeFormatter.ofPattern("yyyy/MM/dd/12/");
        DateTimeFormatter nombreFormatter = DateTimeFormatter.ofPattern("yyyyMMdd");

        String urlBaseFecha = baseURL + hoy.format(pathFormatter);
        String fechaArchivo = hoy.format(nombreFormatter);
        
        List<CompletableFuture<Void>> futuros = new ArrayList<>();

        for (int i = 6; i <= 30; i++) {
            String numero = String.format("%03d", i);
            String nombreArchivo = "WRFDETAR_01H_" + fechaArchivo + "_12_" + numero + ".nc";

            String finalNombreArchivo = nombreArchivo;
            //Para cada archivo, descarga en paralelo
            CompletableFuture<Void> futuro = CompletableFuture.runAsync(() -> {
                boolean exito = descargaConReintento(urlBaseFecha, finalNombreArchivo);
                if (!exito) {
                    archivosFallidos.put(urlBaseFecha, finalNombreArchivo);
                    logger.error("❌ No se pudo descargar " + finalNombreArchivo + " luego de " + MAX_REINTENTOS + " intentos.");
                }
            }, executor);

            futuros.add(futuro);
        }

        CompletableFuture.allOf(futuros.toArray(new CompletableFuture[0])).join();
    }

    private Boolean descargaConReintento(String fileURL, String fileName) {
        int intento = 0;
        boolean exito = false;

        while (intento < MAX_REINTENTOS && !exito) {
            try {
                intento++;
                logger.info("Intento " + intento + " para archivo: " + fileName);
                descarga(fileURL, fileName);
                exito = true;
                //exitosas.incrementAndGet();
            } catch (IOException e) {
                logger.error("Fallo intento " + intento + " para " + fileName + ": " + e.getMessage());
                if (intento < MAX_REINTENTOS) {
                    try {
                        Thread.sleep(RETARDO_ENTRE_INTENTOS_MS);
                    } catch (InterruptedException ie) {
                        Thread.currentThread().interrupt();
                    }
                }
            }
        }
        return exito;
        /*
        if (!exito) {
            archivosFallidos.put(fileName, fileURL);
            logger.error("❌ No se pudo descargar " + fileName + " luego de " + MAX_REINTENTOS + " intentos.");
        }*/
    }

    private void descarga(String fileURL, String fileName) throws IOException {
        String saveDir = awsProperty.getSaveDir();
        URL url = new URL(fileURL + fileName);
        HttpURLConnection httpConn = (HttpURLConnection) url.openConnection();
        httpConn.setRequestProperty("User-Agent", "Mozilla/5.0");

        int responseCode = httpConn.getResponseCode();

        if (responseCode == HttpURLConnection.HTTP_MOVED_TEMP ||
            responseCode == HttpURLConnection.HTTP_MOVED_PERM ||
            responseCode == HttpURLConnection.HTTP_SEE_OTHER) {

            String newUrl = httpConn.getHeaderField("Location");
            httpConn = (HttpURLConnection) new URL(newUrl).openConnection();
            httpConn.setRequestProperty("User-Agent", "Mozilla/5.0");
            responseCode = httpConn.getResponseCode();
        }

        if (responseCode == HttpURLConnection.HTTP_OK) {
            //logger.info("Conexión exitosa: " + fileName);

            File saveDirectory = new File(saveDir);
            if (!saveDirectory.exists()) {
                saveDirectory.mkdirs();
            }

            try (BufferedInputStream in = new BufferedInputStream(httpConn.getInputStream());
                 FileOutputStream out = new FileOutputStream(new File(saveDir, fileName))) {

                byte[] buffer = new byte[4096];
                int bytesRead;
                while ((bytesRead = in.read(buffer)) != -1) {
                    out.write(buffer, 0, bytesRead);
                }
                logger.info("Archivo descargado: " + fileName);
            }
        } else {
            throw new IOException("Código de respuesta HTTP: " + responseCode);
        }

        httpConn.disconnect();
    }

    private void mostrarResumen() {
        logger.info("📋 Resumen de descarga:");
        logger.info("✔️ Descargas exitosas: " + exitosas.get());
        logger.info("❌ Descargas fallidas: " + fallidas.get());

        // Reset contadores para la próxima ejecución
        exitosas.set(0);
        fallidas.set(0);
    }
    
    @Scheduled(cron = "0 30 * * * *") // Cada hora a los 30 minutos
    public void reintentarDescargasFallidas() {
        if (archivosFallidos.isEmpty()) {
            logger.info("No hay archivos pendientes para reintentar.");
            return;
        }
    
        logger.info("Reintentando descarga de archivos fallidos...");
        Map<String, String> fallidosPendientes = new ConcurrentHashMap<>();
    
        List<CompletableFuture<Void>> futuros = archivosFallidos.entrySet().stream()
            .map(entry -> CompletableFuture.runAsync(() -> {
                String fileURL = entry.getKey();
                String fileName = entry.getValue();
    
                boolean exito = descargaConReintento(fileURL, fileName);
                if (!exito) {
                    fallidosPendientes.put(fileURL, fileName);
                }
            }, executor))
            .toList();
    
        CompletableFuture.allOf(futuros.toArray(new CompletableFuture[0])).join();
    
        // Limpiar los que descargaron correctamente
        archivosFallidos.clear();
        archivosFallidos.putAll(fallidosPendientes);
    
        logger.info("Reintento completo. Fallidos restantes: " + archivosFallidos.size());
    }

    private void borrarArchivos(int desde, int hasta, boolean mismoDia) {
        LocalDateTime ahora = LocalDateTime.now(ZoneId.of("America/Argentina/Buenos_Aires"));
        LocalDate fecha = mismoDia==true?ahora.toLocalDate():ahora.minusDays(1).toLocalDate();
        DateTimeFormatter nombreFormatter = DateTimeFormatter.ofPattern("yyyyMMdd");
        String fechaArchivo = fecha.format(nombreFormatter);

        for (int i = desde; i <= hasta; i++) {
            String numero = String.format("%03d", i);
            String nombreArchivo = "WRFDETAR_01H_" + fechaArchivo + "_12_" + numero + ".nc";
            File archivo = new File(awsProperty.getSaveDir(), nombreArchivo);
            if (archivo.exists()) {
                if (archivo.delete()) {
                    logger.info("Archivo borrado: " + archivo.getName());
                } else {
                    logger.error("No se pudo borrar: " + archivo.getName());
                }
            } else {
                logger.warn("Archivo no encontrado: " + archivo.getName());
            }
        }
    }

    public void descargarArchivosManual() {
        String baseURL = awsProperty.getRepo();

        ZonedDateTime ahora = ZonedDateTime.now(ZoneId.of("America/Argentina/Buenos_Aires"));
        LocalDate fechaDescarga = ahora.getHour() <= 18  ? ahora.minusDays(1).toLocalDate() : ahora.toLocalDate();

        DateTimeFormatter pathFormatter = DateTimeFormatter.ofPattern("yyyy/MM/dd/12/");
        DateTimeFormatter nombreFormatter = DateTimeFormatter.ofPattern("yyyyMMdd");

        String urlBaseFecha = baseURL + fechaDescarga.format(pathFormatter);
        String fechaArchivo = fechaDescarga.format(nombreFormatter);
        
        List<CompletableFuture<Void>> futuros = new ArrayList<>();

        for (int i = 6; i <= 30; i++) {
            String numero = String.format("%03d", i);
            String nombreArchivo = "WRFDETAR_01H_" + fechaArchivo + "_12_" + numero + ".nc";

            String finalNombreArchivo = nombreArchivo;
            //Para cada archivo, descarga en paralelo
            CompletableFuture<Void> futuro = CompletableFuture.runAsync(() -> {
                boolean exito = descargaConReintento(urlBaseFecha, finalNombreArchivo);
                if (!exito) {
                    archivosFallidos.put(urlBaseFecha, finalNombreArchivo);
                    logger.error("❌ No se pudo descargar " + finalNombreArchivo + " luego de " + MAX_REINTENTOS + " intentos.");
                }
            }, executor);

            futuros.add(futuro);
        }

        CompletableFuture.allOf(futuros.toArray(new CompletableFuture[0])).join();
    }

    //Para swagger
    @GetMapping("/ultima-ejecucion")
    public String ultimaEjecucion() {
        return ultimaEjecucion != null ? ultimaEjecucion.toString() : "Nunca ejecutada";
    }
}