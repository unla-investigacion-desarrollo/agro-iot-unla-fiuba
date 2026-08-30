/*package com.unla.pronostico;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

import java.io.File;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Map;
import java.util.concurrent.*;

import org.junit.jupiter.api.*;
import org.mockito.*;
import org.springframework.test.util.ReflectionTestUtils;
//import com.unla.pronostico.model.dto.properties.AwsProperty;

public class DescargaWRFJobTest {

    @Mock
    private AwsProperty awsProperty;

    @InjectMocks
    private DescargaWRFJob descargaWRFJob;

    private File tempDir;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
        descargaWRFJob = spy(new DescargaWRFJob());
        ReflectionTestUtils.setField(descargaWRFJob, "awsProperty", awsProperty);
        ReflectionTestUtils.setField(descargaWRFJob, "executor", Executors.newFixedThreadPool(2));

        // Crear un directorio temporal para pruebas de archivos
        tempDir = new File(System.getProperty("java.io.tmpdir"), "wrf-test");
        tempDir.mkdirs();
        ReflectionTestUtils.setField(descargaWRFJob, "saveDir", tempDir.getAbsolutePath());
    }

    @AfterEach
    public void tearDown() {
        for (File file : tempDir.listFiles()) {
            file.delete();
        }
        tempDir.delete();
    }

    @Test
    public void testReintentarDescargasFallidas_limpiaFallidosSiExito() {
        Map<String, String> archivosFallidos = new ConcurrentHashMap<>();
        archivosFallidos.put("http://mocked-url/", "archivo1.nc");
        archivosFallidos.put("http://mocked-url/", "archivo2.nc");

        ReflectionTestUtils.setField(descargaWRFJob, "archivosFallidos", archivosFallidos);

        doReturn(true).when(descargaWRFJob).descargaConReintento(anyString(), anyString());

        descargaWRFJob.reintentarDescargasFallidas();

        Map<String, String> result = (Map<String, String>) ReflectionTestUtils.getField(descargaWRFJob, "archivosFallidos");
        assertTrue(result.isEmpty(), "archivosFallidos debería estar vacío tras reintento exitoso");
    }

    @Test
    public void testReintentarDescargasFallidas_mantieneFallidosSiFalla() {
        Map<String, String> archivosFallidos = new ConcurrentHashMap<>();
        archivosFallidos.put("http://mocked-url/", "archivo_fallo.nc");

        ReflectionTestUtils.setField(descargaWRFJob, "archivosFallidos", archivosFallidos);

        doReturn(false).when(descargaWRFJob).descargaConReintento(anyString(), anyString());

        descargaWRFJob.reintentarDescargasFallidas();

        Map<String, String> result = (Map<String, String>) ReflectionTestUtils.getField(descargaWRFJob, "archivosFallidos");
        assertEquals(1, result.size(), "El archivo fallido debe seguir en el mapa");
        assertTrue(result.containsKey("http://mocked-url/"));
    }

    @Test
    public void testBorrarArchivos_borraCorrectamente() {
        // Crear archivos ficticios del día anterior con nombres válidos
        LocalDate ayer = LocalDate.now().minusDays(1);
        DateTimeFormatter nombreFormatter = DateTimeFormatter.ofPattern("yyyyMMdd");
        String fechaArchivo = ayer.format(nombreFormatter);

        for (int i = 6; i <= 8; i++) {
            String numero = String.format("%03d", i);
            String nombreArchivo = "WRFDETAR_01H_" + fechaArchivo + "_12_" + numero + ".nc";
            File archivo = new File(tempDir, nombreArchivo);
            try {
                assertTrue(archivo.createNewFile(), "Archivo de prueba no pudo crearse: " + nombreArchivo);
            } catch (Exception e) {
                fail("Error creando archivo de prueba: " + e.getMessage());
            }
        }

        descargaWRFJob.borrarArchivos(6, 8);

        for (int i = 6; i <= 8; i++) {
            String numero = String.format("%03d", i);
            String nombreArchivo = "WRFDETAR_01H_" + fechaArchivo + "_12_" + numero + ".nc";
            File archivo = new File(tempDir, nombreArchivo);
            assertFalse(archivo.exists(), "Archivo debería haber sido borrado: " + nombreArchivo);
        }
    }
}*/