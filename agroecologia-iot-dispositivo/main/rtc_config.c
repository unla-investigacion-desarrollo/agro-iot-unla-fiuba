#include <string.h>
#include <sys/param.h>
#include <stdlib.h>
#include <driver/gpio.h>
#include <cJSON.h>
#include "esp_log.h"
#include "esp_tls.h"

#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "esp_system.h"

#include "esp_http_client.h"

#define MAX_HTTP_OUTPUT_BUFFER 2048
#define NTP_SERVER "http://worldtimeapi.org/api/timezone/America/Argentina/Buenos_Aires"

#include "rtc_config.h"

static const char *TAG = "RTC_CONFIG";

esp_err_t _http_event_handler(esp_http_client_event_t *evt)
{
    static char *output_buffer;  // Buffer to store response of http request from event handler
    static int output_len;       // Stores number of bytes read
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
            ESP_LOGD(TAG, "HTTP_EVENT_ON_HEADER, key=%s, value=%s", evt->header_key, evt->header_value);
            break;
        case HTTP_EVENT_ON_DATA:
            ESP_LOGD(TAG, "HTTP_EVENT_ON_DATA, len=%d", evt->data_len);
            // Clean the buffer in case of a new request
            if (output_len == 0 && evt->user_data) {
                // we are just starting to copy the output data into the use
                memset(evt->user_data, 0, MAX_HTTP_OUTPUT_BUFFER);
            }
            /*
             *  Check for chunked encoding is added as the URL for chunked encoding used in this example returns binary data.
             *  However, event handler can also be used in case chunked encoding is used.
             */
            if (!esp_http_client_is_chunked_response(evt->client)) {
                // If user_data buffer is configured, copy the response into the buffer
                int copy_len = 0;
                if (evt->user_data) {
                    // The last byte in evt->user_data is kept for the NULL character in case of out-of-bound access.
                    copy_len = MIN(evt->data_len, (MAX_HTTP_OUTPUT_BUFFER - output_len));
                    if (copy_len) {
                        memcpy(evt->user_data + output_len, evt->data, copy_len);
                    }
                } else {
                    int content_len = esp_http_client_get_content_length(evt->client);
                    if (output_buffer == NULL) {
                        // We initialize output_buffer with 0 because it is used by strlen() and similar functions therefore should be null terminated.
                        output_buffer = (char *) calloc(content_len + 1, sizeof(char));
                        output_len = 0;
                        if (output_buffer == NULL) {
                            ESP_LOGE(TAG, "Failed to allocate memory for output buffer");
                            return ESP_FAIL;
                        }
                    }
                    copy_len = MIN(evt->data_len, (content_len - output_len));
                    if (copy_len) {
                        memcpy(output_buffer + output_len, evt->data, copy_len);
                    }
                }
                output_len += copy_len;
            }

            break;
        case HTTP_EVENT_ON_FINISH:
            ESP_LOGD(TAG, "HTTP_EVENT_ON_FINISH");
            if (output_buffer != NULL) {
                free(output_buffer);
                output_buffer = NULL;
            }
            output_len = 0;
            break;
        case HTTP_EVENT_DISCONNECTED:
            ESP_LOGI(TAG, "HTTP_EVENT_DISCONNECTED");
            int mbedtls_err = 0;
            esp_err_t err = esp_tls_get_and_clear_last_error((esp_tls_error_handle_t)evt->data, &mbedtls_err, NULL);
            if (err != 0) {
                ESP_LOGI(TAG, "Last esp error code: 0x%x", err);
                ESP_LOGI(TAG, "Last mbedtls failure: 0x%x", mbedtls_err);
            }
            if (output_buffer != NULL) {
                free(output_buffer);
                output_buffer = NULL;
            }
            output_len = 0;
            break;
    }
    return ESP_OK;
}

char response[MAX_HTTP_OUTPUT_BUFFER] = {0};

void rtc_config_init(void)
{
    char *response = https_request();
    // Parsear el json que retorna y configurar el rtc con el campo datetime
    cJSON *json = cJSON_Parse(response);
    cJSON *datetime = cJSON_GetObjectItemCaseSensitive(json, "datetime");

    // Inicia el RTC con la fecha y hora obtenida del servidor
    struct tm tm;
    strptime(datetime->valuestring, "%Y-%m-%dT%H:%M:%S%z", &tm);
    time_t t = mktime(&tm);
    struct timeval now = {.tv_sec = t};
    settimeofday(&now, NULL);

    // Libera la memoria del json
    cJSON_Delete(json);

    // Imprime la fecha y hora actual
    char strftime_buf[64];
    struct tm timeinfo;
    localtime_r(&t, &timeinfo);
    strftime(strftime_buf, sizeof(strftime_buf), "%c", &timeinfo);
    ESP_LOGI(TAG, "La hora actual en Buenos Aires es: %s", strftime_buf);
}

char* https_request(void)
{
    esp_http_client_config_t config = {
            .url = NTP_SERVER,
            .event_handler = _http_event_handler,
            .user_data = response,
    };

    esp_http_client_handle_t client = esp_http_client_init(&config);
    esp_err_t err = esp_http_client_perform(client);

    if (err == ESP_OK) {
        ESP_LOGI(TAG, "HTTPS Status = %d", esp_http_client_get_status_code(client));
    } else {
        ESP_LOGE(TAG, "Error perform http request %s", esp_err_to_name(err));
    }

    esp_http_client_cleanup(client);

    return response;
}

void activar_salida(ActivarSalidaParams *params)
{
    int pin = params->pin;
    int time = params->time;

    gpio_set_direction(pin, GPIO_MODE_OUTPUT);     // Configura el pin como salida
    gpio_set_level(pin, 1);                         // Activa el pin
    vTaskDelay(time * 1000 / portTICK_PERIOD_MS);    // Espera 1 minuto
    gpio_set_level(pin, 0);                         // Desactiva el pin
}