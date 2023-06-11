#include "data_transmitter.h"
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "esp_http_client.h"
#include "wifi.h"
#include <stdio.h>
#include <string.h>
#include "config.h"

#define MAX_SENSORS 30
#define TX_BUFF_SIZE (1024*16) //16k just in case

struct
{
	char name[30];
	void * pSensorTda;
	void (*sensorRead)(void *,char *, int);

}registeredSensors[MAX_SENSORS];

void dataTransmitterInit(void)
{
	for(int i=0;i<MAX_SENSORS;i++) registeredSensors[i].sensorRead = NULL; //to crete free slots
}

int dataTransmitterRegisterSensor(char * name, void * pSensorTda, void (*sensorRead)(void *,char *, int))
{
	for(int i=0;i<MAX_SENSORS;i++)
	{
		if(registeredSensors[i].sensorRead == NULL)
		{
			strcpy(registeredSensors[i].name, name);
			registeredSensors[i].pSensorTda = pSensorTda;
			registeredSensors[i].sensorRead = sensorRead;
			return 1;
		}
	}
	return 0;
}

void appendToTxBuffer(char * txBuffer, char *name, char *value)
{
	int len = strlen(txBuffer);
	sprintf(&txBuffer[len],"\"%s\":%s,",name,value);
}

void dataTransmitterTask(void * parameter)
{
	char * txBuffer = malloc(TX_BUFF_SIZE);
	while(1)
	{
		vTaskDelay(1000 / portTICK_PERIOD_MS);
		wifi_wait_connected();
		strcpy(txBuffer,"{");
		for(int i=0;i<MAX_SENSORS;i++)
		{
			if(registeredSensors[i].sensorRead != NULL)
			{
				char value[100];
				registeredSensors[i].sensorRead( registeredSensors[i].pSensorTda,value,100);
				appendToTxBuffer(txBuffer, registeredSensors[i].name, value);
			}
		}
		txBuffer[strlen(txBuffer) -1] = '}'; //cambiamos la , por }
        esp_http_client_config_t config = {
            .url = DATA_ENDPOINT,
        };
        esp_http_client_handle_t client = esp_http_client_init(&config);
	    esp_http_client_set_method(client, HTTP_METHOD_POST);
	    esp_http_client_set_header(client, "Content-Type", "application/json");
	    esp_http_client_set_post_field(client, txBuffer, strlen(txBuffer));
	    esp_http_client_perform(client);
	    esp_http_client_cleanup(client);
	    printf("%s\n",txBuffer);
	}
}

void dataTransmitterStart(void)
{
	xTaskCreate(dataTransmitterTask,"dataTxTask", 10000, NULL, 1, NULL);
}

void dataTransmitterPrintTask(void * parameter)
{
	
  printf("-------------------------TEST PRINT\n");
	char * txBuffer = malloc(TX_BUFF_SIZE);
	//while(1)
	//{
	//	vTaskDelay(1000 / portTICK_PERIOD_MS);
	//	wifi_wait_connected();
	  strcpy(txBuffer,"{");
		for(int i=0;i<MAX_SENSORS;i++)
		{
			if(registeredSensors[i].sensorRead != NULL)
			{
				char value[100];
				registeredSensors[i].sensorRead( registeredSensors[i].pSensorTda,value,100);
				appendToTxBuffer(txBuffer, registeredSensors[i].name, value);
			}
		}
		txBuffer[strlen(txBuffer) -1] = '}'; //cambiamos la , por }
		printf("Temperature is ");
		printf(txBuffer);
		printf("Temperature DONE");
	//}
}

void dataTransmitterPrintStart(void)
{
	xTaskCreate(dataTransmitterPrintTask,"dataTxTask", 10000, NULL, 1, NULL);
}