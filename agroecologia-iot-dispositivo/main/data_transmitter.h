#ifndef DATA_TRANSMITTER_H
#define DATA_TRANSMITTER_H

#include "sensor_manager.h"

void dataTransmitterInit(void);
int dataTransmitterRegisterSensor(char * name, void * pSensorTda, void (*sensorRead)(void *,char *, int));
void dataTransmitterStart(void);
void jsonHandler(char * data);
void activatePinWithDuration(int pin, int duration_ms);

#endif
