/* ESP HTTP Client Example

   This example code is in the Public Domain (or CC0 licensed, at your option.)

   Unless required by applicable law or agreed to in writing, this
   software is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
   CONDITIONS OF ANY KIND, either express or implied.
*/

#include <string.h>
#include <stdlib.h>
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "esp_log.h"
#include "esp_system.h"
#include "nvs_flash.h"
#include "esp_event.h"
#include "esp_netif.h"
#include "esp_tls.h"
#include "esp_crt_bundle.h"
#include "wifi.h"
#include "esp_http_client.h"
#include "cJSON.h"
#include "timed_outputs.h"
#include "config.h"

#define MAX_HTTP_RECV_BUFFER 512
#define MAX_HTTP_OUTPUT_BUFFER 2048
static const char *TAG = "COMMAND_PROCESSOR";

/* Root cert for howsmyssl.com, taken from howsmyssl_com_root_cert.pem

   The PEM file was extracted from the output of this command:
   openssl s_client -showcerts -connect www.howsmyssl.com:443 </dev/null

   The CA root cert is the last cert given in the chain of certs.

   To embed it in the app binary, the PEM file is named
   in the component.mk COMPONENT_EMBED_TXTFILES variable.
*/
extern const char howsmyssl_com_root_cert_pem_start[] asm("_binary_howsmyssl_com_root_cert_pem_start");
extern const char howsmyssl_com_root_cert_pem_end[]   asm("_binary_howsmyssl_com_root_cert_pem_end");

extern const char postman_root_cert_pem_start[] asm("_binary_postman_root_cert_pem_start");
extern const char postman_root_cert_pem_end[]   asm("_binary_postman_root_cert_pem_end");





 char output_buffer[2048];
 int output_len=0;       // Stores number of bytes read

esp_err_t _http_event_handler(esp_http_client_event_t *evt)
{


    switch(evt->event_id) {
        case HTTP_EVENT_ERROR:
            ESP_LOGD(TAG, "HTTP_EVENT_ERROR");
            break;
        case HTTP_EVENT_ON_CONNECTED:
            ESP_LOGD(TAG, "HTTP_EVENT_ON_CONNECTED");
            break;
        case HTTP_EVENT_HEADER_SENT:
            ESP_LOGD(TAG, "HTTP_EVENT_HEADER_SENT");
            break;
        case HTTP_EVENT_ON_HEADER:
        	output_len=0;
            ESP_LOGD(TAG, "HTTP_EVENT_ON_HEADER, key=%s, value=%s", evt->header_key, evt->header_value);
            break;
        case HTTP_EVENT_ON_DATA:
            ESP_LOGD(TAG, "HTTP_EVENT_ON_DATA, len=%d", evt->data_len);
            /*
             *  Check for chunked encoding is added as the URL for chunked encoding used in this example returns binary data.
             *  However, event handler can also be used in case chunked encoding is used.
             */
            if (!esp_http_client_is_chunked_response(evt->client)) {
                // If user_data buffer is configured, copy the response into the buffer
                if (evt->user_data) {
                    memcpy(evt->user_data + output_len, evt->data, evt->data_len);
                } else {
                    memcpy(output_buffer + output_len, evt->data, evt->data_len);
                }
                output_len += evt->data_len;
            }

            break;
        case HTTP_EVENT_ON_FINISH:
            ESP_LOGD(TAG, "HTTP_EVENT_ON_FINISH");
            if (output_buffer != NULL) {
            	output_buffer[output_len] = 0;

            }
            break;
        case HTTP_EVENT_DISCONNECTED:
            ESP_LOGI(TAG, "HTTP_EVENT_DISCONNECTED");
            int mbedtls_err = 0;
            esp_err_t err = esp_tls_get_and_clear_last_error(evt->data, &mbedtls_err, NULL);
            if (err != 0) {
                ESP_LOGI(TAG, "Last esp error code: 0x%x", err);
                ESP_LOGI(TAG, "Last mbedtls failure: 0x%x", mbedtls_err);
            }
            output_len = 0;
            break;
    }
    return ESP_OK;
}



void commandsProcessorTask(void *pvParameters)
{
    esp_http_client_config_t config = {
        .url = COMMANDS_ENPOINT,
        .event_handler = _http_event_handler,
		.timeout_ms=15000,
    };
    esp_http_client_handle_t client = esp_http_client_init(&config);

	while(1)
	{
		wifi_wait_connected();


		esp_err_t espError = esp_http_client_perform(client);

		if (espError == ESP_OK)
		{

			if(esp_http_client_get_status_code(client)!=200)
			{
				ESP_LOGE(TAG,"UPDATE HTTP ERROR %d",esp_http_client_get_status_code(client));
				continue;
			}

			if(output_buffer[0]==0) continue;

			cJSON *root = cJSON_Parse(output_buffer);
			char *commandName = cJSON_GetObjectItem(root,"name")->valuestring;
			cJSON *params = cJSON_GetObjectItem(root,"params");
			int time = cJSON_GetObjectItem(params,"time")->valueint;

			if(strcmp(commandName,"water_on")!=0) ESP_LOGE(TAG, "Comando no reconocido %s", commandName);
			else
			{
				timedOutputOn(0, time);
			}

			cJSON_Delete(root);

		}
		else
		{
			ESP_LOGE(TAG, "Error perform http request %s in commandsProcessorTask", esp_err_to_name(espError));
			esp_http_client_cleanup(client);
			client = esp_http_client_init(&config);
			vTaskDelay(10000 / portTICK_PERIOD_MS);  //En caso de error esperamos 10 segundos entre reintentos para reducir el spam en los logs

		}

	}



}



void commandsProcessorInit(void)
{

	xTaskCreate(&commandsProcessorTask, "getUpatesTask", 8192, NULL, 5, NULL);

}





