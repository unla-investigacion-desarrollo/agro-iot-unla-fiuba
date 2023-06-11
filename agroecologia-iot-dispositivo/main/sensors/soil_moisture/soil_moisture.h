/*
 * soil_moisture.h
 *
 *  Created on: 2 jul. 2022
 *      Author: Damian
 */

#ifndef SOILMOISTURE_SOIL_MOISTURE_H_
#define SOILMOISTURE_SOIL_MOISTURE_H_

#include <stdint.h>

typedef struct
{
	void * pAdcTda;
	double (*adcRead)(void *,uint8_t);
	uint8_t adcPin;
	double wetValue;
	double dryValue;

}soil_moisture_t;


soil_moisture_t * soilMoistureInit(void * pAdcTda,double (*adcRead)(void *,uint8_t), double wetValue, double dryValue , uint8_t adcPin);
void soilMoistureDestroy(soil_moisture_t * pSoilMoisture);
int soilMoistureRead(soil_moisture_t * pSoilMoisture);
void soilMoistureGenericRead(void * pSoilMoisture, char * buffer, int bufflen);



#endif /* SOILMOISTURE_SOIL_MOISTURE_H_ */
