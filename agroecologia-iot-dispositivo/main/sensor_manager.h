#ifndef SENSOR_MANAGER_H
#define SENSOR_MANAGER_H

#include <stddef.h>
#include <stdbool.h>
#include "nvs_flash.h"

#define MAX_SENSORS 10

struct Sensor {
    char name[30];
    void *pSensorTda;
    void (*sensorRead)(void *,char *, int);
};

bool create_array(struct Sensor *sensores, size_t size);
bool read_array(struct Sensor *sensores, size_t *size);
bool add_sensor(struct Sensor *array, size_t *size, struct Sensor sensor);
bool remove_sensor(struct Sensor *array, size_t *size, char *name);
struct Sensor create_sensor(char *name, void *pSensorTda, void (*sensorRead) (void *,char *, int));
void print_sensores(struct Sensor *sensores, size_t size);
bool save_array(struct Sensor pSensor[MAX_SENSORS], size_t sensores);

#endif //SENSOR_MANAGER_H