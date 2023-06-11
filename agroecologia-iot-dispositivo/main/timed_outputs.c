#include "timed_outputs.h"
#include <stdlib.h>
#include "freertos/FreeRTOS.h"
#include "freertos/timers.h"
#include "esp_log.h"
#include "esp_system.h"
#include "driver/gpio.h"

#define MAX_OUTPUTS 1



typedef struct
{
	int64_t offTime;
    int gpio;

} timed_output;



static timed_output timedOutputsArray[MAX_OUTPUTS];
static void timedOutputsTimerFunction( TimerHandle_t xTimer );




void timedOutputsInit(void)
{

	TimerHandle_t timer;

    for (int i = 0; i < MAX_OUTPUTS; i++)
    {
        timedOutputsArray[i].gpio = -1;
        timedOutputsArray[i].offTime = -1;
    }


    timer=xTimerCreate("Timer",pdMS_TO_TICKS( 20 ), 1,  ( void * ) 0,timedOutputsTimerFunction);

    xTimerStart(timer,0);

}

int timedOutputsAdd(int gpio)
{

    for (int i = 0; i < MAX_OUTPUTS; i++)
    {
    	if(timedOutputsArray[i].gpio == -1)
    	{
    		timedOutputsArray[i].gpio=gpio;
    		gpio_set_direction(gpio,  GPIO_MODE_OUTPUT);
    		gpio_set_level(gpio, 0);

    		return 1;
    	}
    }

    return 0;
}





static void timedOutputsTimerFunction( TimerHandle_t xTimer )
{


	uint64_t systemTicks = esp_timer_get_time();

    for (int i = 0; i < MAX_OUTPUTS; i++)
    {



    	if(timedOutputsArray[i].gpio != -1 &&
    	   timedOutputsArray[i].offTime != -1 &&
    	   timedOutputsArray[i].offTime <= systemTicks )
    	{

    		gpio_set_level(timedOutputsArray[i].gpio, 0);
    		timedOutputsArray[i].offTime= -1;

    	}

    }

}




void timedOutputOn(int output,  uint64_t duration)
{

    uint64_t systemTicks = esp_timer_get_time();

	if (duration == 0)timedOutputsArray[output].offTime = -1;
	else
	{
		timedOutputsArray[output].offTime = systemTicks + duration * 1000;

	}
	gpio_set_level(timedOutputsArray[output].gpio, 1);

}










