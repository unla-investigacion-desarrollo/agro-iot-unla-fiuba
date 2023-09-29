#include <string.h>
#include <esp_log.h>
#include "sensor_manager.h"
#include "adc/ads1115/ads1115.h"
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"

#define STORAGE_NAMESPACE "storage"

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

bool create_array(struct Sensor *sensores, size_t size) {
    if (sensores == NULL || size == 0) {
        return false;
    }
    // Guarda el arreglo de sensores en NVS
    nvs_handle_t my_handle;
    esp_err_t err = nvs_open(STORAGE_NAMESPACE, NVS_READWRITE, &my_handle);
    if (err != ESP_OK) return false;

    err = nvs_set_blob(my_handle, "sensor_array", sensores, size * sizeof(struct Sensor));
    if (err != ESP_OK) {
        nvs_close(my_handle);
        return false;
    }

    err = nvs_commit(my_handle);
    nvs_close(my_handle);

    return (err == ESP_OK);
}

bool read_array(struct Sensor *sensores, size_t *size) {
    if (sensores == NULL || size == NULL) {
        return false;
    }
    // Lee el arreglo de sensores desde NVS
    nvs_handle_t my_handle;
    esp_err_t err = nvs_open(STORAGE_NAMESPACE, NVS_READWRITE, &my_handle);
    if (err != ESP_OK) return false;

    size_t required_size = 0;
    err = nvs_get_blob(my_handle, "sensor_array", NULL, &required_size);

    if (err != ESP_OK || required_size == 0) {
        nvs_close(my_handle);
        return false;
    }

    if (required_size > *size * sizeof(struct Sensor)) {
        // El tamaño del arreglo en NVS es mayor que el tamaño de destino
        nvs_close(my_handle);
        return false;
    }

    err = nvs_get_blob(my_handle, "sensor_array", sensores, required_size);
    nvs_close(my_handle);

    if (err != ESP_OK) {
        return false;
    }

    *size = required_size / sizeof(struct Sensor);
    return true;
}

bool save_array(struct Sensor *sensores, size_t size) {
    if (sensores == NULL || size == 0) {
        return false;
    }
    // Guarda el arreglo de sensores en NVS
    nvs_handle_t my_handle;
    esp_err_t err = nvs_open(STORAGE_NAMESPACE, NVS_READWRITE, &my_handle);
    if (err != ESP_OK) return false;

    err = nvs_set_blob(my_handle, "sensor_array", sensores, size * sizeof(struct Sensor));
    if (err != ESP_OK) {
        nvs_close(my_handle);
        return false;
    }

    err = nvs_commit(my_handle);
    nvs_close(my_handle);

    return (err == ESP_OK);
}

bool add_sensor(struct Sensor *array, size_t *size, struct Sensor sensor) {
    if (array == NULL || size == NULL || *size >= MAX_SENSORS) {
        return false;
    }
    if (*size < MAX_SENSORS) {
        array[*size] = sensor;
        (*size)++;
        // Guarda el arreglo de sensores en NVS
        if (!save_array(array, *size)) {
            printf("Error guardando el arreglo de sensores en NVS\n");
        }
        return true;
    }
    return false;
}

bool remove_sensor(struct Sensor *sensores, size_t *size, char *name) {
    // Busca el sensor en el array
    for (size_t i = 0; i < *size; i++) {
        if (strcmp(sensores[i].name, name) == 0) {
            // Elimina el sensor del array
            for (size_t j = i; j < *size - 1; j++) {
                sensores[j] = sensores[j + 1];
            }

            // Actualiza el tamaño del array
            (*size)--;

            return true;
        }
    }

    // El sensor no se encontró
    return false;
}

struct Sensor create_sensor(char *name, void *pSensorTda, void (*sensorRead) (void *,char *, int)) {
    struct Sensor newSensor;

    strncpy(newSensor.name, name, sizeof(newSensor.name));
    newSensor.name[sizeof(newSensor.name) - 1] = '\0';
    newSensor.pSensorTda = pSensorTda;
    newSensor.sensorRead = sensorRead;

    return newSensor;
}

void print_sensores(struct Sensor *sensores, size_t size) {
    printf("Sensores agregados:\n");
    for (size_t i = 0; i < size; i++) {
        printf("Nombre: %s\n", sensores[i].name);
    }
}