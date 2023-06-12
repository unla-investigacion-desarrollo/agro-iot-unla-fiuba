#ifndef ADS1115_H
#define ADS1115_H
#include <stdint.h>

typedef struct
{
    uint8_t i2cPort;
    uint8_t addr;
    uint8_t sdaPin;
    uint8_t sclPin;

}ads1155_t;
ads1155_t * ads1115Init(uint8_t i2cPort, uint8_t addr, uint8_t sdaPin, uint8_t sclPin);
void ads1115Destroy(ads1155_t *pAds1115);
double ads1115Read(ads1155_t * pAds1115, uint8_t pin);
double ads1115GenericRead(void * pAds1115, uint8_t pin);



#endif
