#include <stdio.h>
#include <time.h>
#include <driver/gpio.h>
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
#include "rtc_config.h"


void calibrar() {
    ads1155_t * pAds115 = ads1115Init(0, 0x48, 21, 22);
    double max = 0;
    double min = 10;
    while(1)
    {
        vTaskDelay(1000 / portTICK_PERIOD_MS);
        double lectura = ads1115GenericRead(pAds115, 0);

        if (lectura > max) max = lectura;
        if (lectura < min) min = lectura;

        printf("data: max=%f min=%f act=%f\n", max, min, lectura);
    }
}

void app_main(void)
{
    configInit();
    esp_err_t ret = nvs_flash_init();
    if (ret == ESP_ERR_NVS_NO_FREE_PAGES || ret == ESP_ERR_NVS_NEW_VERSION_FOUND) {
        ESP_ERROR_CHECK(nvs_flash_erase());
        ret = nvs_flash_init();
    }
    ESP_ERROR_CHECK(ret);

    wifi_init_sta(projectConfig.wifiSSID, projectConfig.wifiPass);
    rtc_config_init();

    gpio_set_direction(4, GPIO_MODE_OUTPUT);
    gpio_set_level(4, 0);

    bool activado = false;

    while (1) {
        // Verifica la hora actual y si son las 7 AM activa la salida 1 por 1 minuto
        struct tm timeinfo;
        time_t now;
        time(&now);
        localtime_r(&now, &timeinfo);

        // Si son las 7 AM activa la salida 1 por 1 minuto
        if (timeinfo.tm_hour == 22 && timeinfo.tm_min == 8 && !activado) {
            ActivarSalidaParams params = {
                    .pin = 4,
                    .time = 60
            };
            activar_salida(&params);
            activado = true;
        } else if (timeinfo.tm_hour != 7) {
            activado = false;
        }

        vTaskDelay(1000 / portTICK_PERIOD_MS);
    }

    //timedOutputsInit();
    //timedOutputsAdd(2);

    //calibrar();

    /*ads1155_t * pAds115 = ads1115Init(0, 0x48, 21, 22);
    soil_moisture_t * pSoilMoisture = soilMoistureInit(pAds115, ads1115GenericRead, 1.214, 2.844, 0);

    dht22_t * pDht22=dht22Init(15);
    vTaskDelay(5000 / portTICK_PERIOD_MS); // dht22 necsita un tiempo para estabilizarse

    dataTransmitterInit();
    dataTransmitterRegisterSensor("ta", pDht22, dht22GenericReadTemp); //Temperatura ambiente
    dataTransmitterRegisterSensor("hr", pDht22, dht22GenericReadRH); //Humedad relativa
    dataTransmitterRegisterSensor("hs", pSoilMoisture, soilMoistureGenericRead); //Humedad sustrato

    dataTransmitterStart();*/
}