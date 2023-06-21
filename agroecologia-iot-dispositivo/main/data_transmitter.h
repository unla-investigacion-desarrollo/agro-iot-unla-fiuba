#ifndef DATA_TRANSMITTER_H
#define DATA_TRANSMITTER_H

void dataTransmitterInit(void);
int dataTransmitterRegisterSensor(char * name, void * pSensorTda, void (*sensorRead)(void *,char *, int));
void dataTransmitterStart(void);

#endif
