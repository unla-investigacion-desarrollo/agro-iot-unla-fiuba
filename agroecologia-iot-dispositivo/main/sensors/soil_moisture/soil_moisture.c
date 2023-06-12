#include "soil_moisture.h"
#include "freertos/FreeRTOS.h"
#include <stdio.h>

soil_moisture_t * soilMoistureInit(void * pAdcTda,double (*adcRead)(void *,uint8_t), double wetValue, double dryValue , uint8_t adcPin)
{
	soil_moisture_t * pSoilMoisture = malloc(sizeof(soil_moisture_t));
	pSoilMoisture->pAdcTda= pAdcTda;
	pSoilMoisture->adcRead= adcRead;
	pSoilMoisture->wetValue= wetValue;
	pSoilMoisture->dryValue= dryValue;
	pSoilMoisture->adcPin= adcPin;

	return pSoilMoisture;
}


void soilMoistureDestroy(soil_moisture_t * pSoilMoisture)
{
	free(pSoilMoisture);
}

int soilMoistureRead(soil_moisture_t * pSoilMoisture)
{
	double value =  pSoilMoisture->adcRead(pSoilMoisture->pAdcTda,pSoilMoisture->adcPin);

	value-=pSoilMoisture->wetValue;
	if(value < 0) value = 0; //solo en caso de que de un valor un poco mas bajo y quede en negativo

	value = (value /( pSoilMoisture->dryValue - pSoilMoisture->wetValue))*100;

	//hay  que invertirlo o nos diria cuan seco en lugar de cuan humedo
	if(value > 100) value = 0;
	else value = 100 - value;


	return value;

}


void soilMoistureGenericRead(void * pSoilMoisture, char * buffer, int bufflen)
{
	int value = soilMoistureRead(pSoilMoisture);
	snprintf(buffer,bufflen,"%d",value);

}

