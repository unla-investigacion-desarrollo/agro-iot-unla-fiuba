#include "dht22.h"
#include "freertos/FreeRTOS.h"
#include <stdio.h>
#include <math.h>
#include "driver/gpio.h"
#include "driver/rmt.h"
#include "esp_log.h"
#include <stdio.h>


#define TAG "DHT22"
#define RMT_RX_CHANNEL 0





dht22_t * dht22Init( uint8_t pin)
{
	dht22_t * pDht22 = malloc(sizeof(dht22_t));
	pDht22->pin= pin;
	gpio_set_direction(pin,  GPIO_MODE_INPUT);
	pDht22->lastReadtimestamp= 0;
	return pDht22;

}


void dht22Destroy(dht22_t * pDht22)
{
	free(pDht22);
}


int isPulseinRange(int pulseWidth,int expectedWidth)
{
	int tolerance = 5; //+-5us de margen


	if(pulseWidth > (expectedWidth - tolerance) &&
	   pulseWidth < (expectedWidth + tolerance)	) return 1;
	else return 0;

}




int dht22Read(dht22_t * pDht22)
{

	rmt_config_t rmt_rx = RMT_DEFAULT_CONFIG_RX(pDht22->pin, RMT_RX_CHANNEL);
	rmt_rx.clk_div = 80;
	rmt_rx.mem_block_num = 5;
	rmt_rx.rmt_mode = RMT_MODE_RX;
	rmt_rx.rx_config.filter_en = false;
	rmt_rx.rx_config.filter_ticks_thresh = 0;
	rmt_rx.rx_config.idle_threshold = 200;
	rmt_item32_t* pItems;
	size_t rx_size = 0;
	RingbufHandle_t rb = NULL;
	uint8_t checksum=0;
	uint64_t data=0;




    //el datasheet pide al menos 2 segundos entre consultas
	if(esp_timer_get_time() - pDht22->lastReadtimestamp  < 3000000) return pDht22->healtStatus;
	pDht22->lastReadtimestamp = esp_timer_get_time();

	rmt_config(&rmt_rx); //pasa automaticamente el gpio a input
	rmt_driver_install(rmt_rx.channel,1200, 0);
	gpio_set_direction(pDht22->pin,  GPIO_MODE_OUTPUT);
	gpio_set_level(pDht22->pin,0);
	esp_rom_delay_us(15000);  //el datasheet pide al menos 10ms



	rmt_get_ringbuf_handle(RMT_RX_CHANNEL, &rb);
    if(rb==NULL)
    {
    	ESP_LOGE(TAG, "FALLO AL OBTENER EL HANDLE DEL RINGBUFFER");
        pDht22->healtStatus = 0;
    }
    else
    {

    	rmt_rx_start(RMT_RX_CHANNEL, 1);
    	gpio_set_direction(pDht22->pin,  GPIO_MODE_INPUT);

    	pItems = (rmt_item32_t*) xRingbufferReceive(rb, &rx_size,  500 /portTICK_PERIOD_MS);
    	rmt_rx_stop(RMT_RX_CHANNEL);
    	if(pItems == NULL) ESP_LOGE(TAG, "SE SUPERO EL MAXIMO TIEMPO DE ESPERA");
    	else
    	{
    		if(isPulseinRange(pItems[0].duration1,80) == 0 ||
    		   isPulseinRange(pItems[1].duration0,80) == 0 	)
    		{
    			ESP_LOGE(TAG, "PULSO FUERA DE RANGO, SE ESPERABA 80us, recibido %d y %d",pItems[0].duration1,pItems[1].duration0 );
    			pDht22->healtStatus = 0;
    		}
    		else
    		{

        		for(int i=1;i<rx_size/4-1;i++)
        		{

        			int low = pItems[i].duration1;
        			int high = pItems[i+1].duration0;
        			if(isPulseinRange(low,50)==0)
        			{
        				ESP_LOGE(TAG, "PULSO FUERA DE RANGO, SE ESPERABA 50us, recibido %d",low);
        				pDht22->healtStatus = 0;
        				break;

        			}

        			data <<= 1;

          			if(isPulseinRange(high,25)==0)
					{

              			if(isPulseinRange(high,70)==1) data|=1;
              			else
              			{
    						ESP_LOGE(TAG, "PULSO FUERA DE RANGO, SE ESPERABA 25us o 70us, recibido %d",high);
    						pDht22->healtStatus = 0;
    						break;
              			}
					}
        		}

        		vRingbufferReturnItem(rb, pItems);


        		for(int i=1;i<=4;i++) checksum+= (data>>(8*i)) &0xFF;

        		if(checksum != (data&0xff))
        		{
        			ESP_LOGE(TAG, "CHECKSUM INVALIDO");
        			pDht22->healtStatus = 0;
        		}
        		else
        		{
        			pDht22->lastReadRH = ((data>>24)&0xFFFF)/10.0;
        			data = ((data>>8)&0xFFFF);
        			if((data & 0x8000) == 0) pDht22->lastReadTemp = data / 10.0;
        			else pDht22->lastReadTemp = (data & 0x7FFF) / -10.0;
        			pDht22->healtStatus = 1;


        		}
    		}
    	}
    }


    rmt_driver_uninstall(RMT_RX_CHANNEL);


	if(pDht22->healtStatus == 0)
	{
		pDht22->lastReadRH = NAN;
		pDht22->lastReadTemp = NAN;
	}

	return pDht22->healtStatus;


}



double dht22ReadRH(dht22_t * pDht22)
{
	dht22Read(pDht22);
    return pDht22->lastReadRH;
}

double dht22ReadTemp(dht22_t * pDht22)
{
	dht22Read(pDht22);
    return pDht22->lastReadTemp;
}


void dht22GenericReadTemp(void * dht22_t, char * buffer, int bufflen)
{
	double value = dht22ReadTemp(dht22_t);
	snprintf(buffer,bufflen,"%.2f",value);
}

void dht22GenericReadRH(void * dht22_t, char * buffer, int bufflen)
{
	double value = dht22ReadRH(dht22_t);
	snprintf(buffer,bufflen,"%.2f",value);
}

