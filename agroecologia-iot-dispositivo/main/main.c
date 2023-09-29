#include <stdio.h>
#include <string.h>
#include "sdkconfig.h"
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "esp_system.h"
#include "nvs_flash.h"
#include "esp_log.h"
#include "adc/ads1115/ads1115.h"
#include "sensors/dht22/dht22.h"
#include "sensors/soil_moisture/soil_moisture.h"
#include "data_transmitter.h"
#include "timed_outputs.h"
#include "config.h"
#include "wifi.h"
#include "sensor_manager.h"

void app_main(void)
{
    configInit();
    esp_err_t ret = nvs_flash_init();
    if (ret == ESP_ERR_NVS_NO_FREE_PAGES || ret == ESP_ERR_NVS_NEW_VERSION_FOUND) {
        ESP_ERROR_CHECK(nvs_flash_erase());
        ret = nvs_flash_init();
    }
    ESP_ERROR_CHECK(ret);

    struct Sensor sensores[MAX_SENSORS];
    size_t cantSensores = 0;

    // Intenta cargar el arreglo de sensores desde NVS
    if (!read_array(sensores, &cantSensores)) {
        printf("Error cargando el arreglo de sensores desde NVS\n");

        if (create_array(sensores, MAX_SENSORS * sizeof(struct Sensor))) {
            printf("Array de sensores vacio agregado.");
        } else {
            printf("Error al guardar el array.");
        }
    }

    dht22_t * pDht22=dht22Init(15);
    vTaskDelay(5000 / portTICK_PERIOD_MS); // dht22 necsita un tiempo para estabilizarse

    struct Sensor sensorNuevo = create_sensor("temperatura ambiente", pDht22, dht22GenericReadRH);
    add_sensor(sensores, &cantSensores, sensorNuevo);

    if (!save_array(sensores, cantSensores)) {
        printf("Error guardando el arreglo de sensores en NVS\n");
    }

    print_sensores(sensores, cantSensores);

    vTaskDelete(NULL);
}