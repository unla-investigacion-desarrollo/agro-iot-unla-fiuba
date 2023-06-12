#ifndef DHT22_H
#define DHT22_H
#include <stdint.h>



typedef struct
{
	uint8_t pin;
	double lastReadRH;
	double lastReadTemp;
	int64_t lastReadtimestamp;
	int healtStatus; //0 si falla la comunicacion, no necesariamente un 1 implica un sensor en buen estado


}dht22_t;


dht22_t * dht22Init( uint8_t pin);
double dht22ReadRH(dht22_t * pDht22);
double dht22ReadTemp(dht22_t * pDht22);
void dht22GenericReadTemp(void * dht22_t, char * buffer, int bufflen);
void dht22GenericReadRH(void * dht22_t, char * buffer, int bufflen);

#endif
