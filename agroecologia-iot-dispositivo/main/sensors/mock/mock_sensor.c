#include "mock_sensor.h"
#include "freertos/FreeRTOS.h"
#include <stdio.h>


mock_sensor_t * mockSensorInit(double value)
{
	mock_sensor_t * pMocksensor = malloc(sizeof(mock_sensor_t));
	pMocksensor->value= value;
	return pMocksensor;
}


void mockSensorDestroy(mock_sensor_t * pMocksensor)
{
	free(pMocksensor);
}

double mockSensorRead(mock_sensor_t * pMocksensor)
{
	return pMocksensor->value;

}


void mockSensorGenericRead(void * pMocksensor, char * buffer, int bufflen)
{
	double value =  mockSensorRead(pMocksensor);
	snprintf(buffer,bufflen,"%.2f",value);

}


