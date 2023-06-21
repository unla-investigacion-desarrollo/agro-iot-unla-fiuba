#include <stdio.h>
#include "sdkconfig.h"
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "esp_system.h"
#include "esp_wifi.h"
#include "nvs_flash.h"
#include "esp_log.h"
#include "freertos/event_groups.h"
#include "esp_http_client.h"
#include "adc/ads1115/ads1115.h"
#include "sensors/dht22/dht22.h"
#include "sensors/mock/mock_sensor.h"
#include "sensors/soil_moisture/soil_moisture.h"
#include "data_transmitter.h"
#include "timed_outputs.h"
#include "config.h"
#include "wifi.h"

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

	timedOutputsInit();
	timedOutputsAdd(2);

    dht22_t * pDht22=dht22Init(15);
	vTaskDelay(5000 / portTICK_PERIOD_MS); // dht22 necsita un tiempo para estabilizarse

    dataTransmitterInit();
    dataTransmitterRegisterSensor("ta", pDht22, dht22GenericReadTemp);
    dataTransmitterRegisterSensor("hr", pDht22, dht22GenericReadRH);

    dataTransmitterStart();
}
