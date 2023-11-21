#ifndef AGROECOLOGIA_IOT_DISPOSITIVO_RTC_CONFIG_H
#define AGROECOLOGIA_IOT_DISPOSITIVO_RTC_CONFIG_H

typedef struct {
    int pin;
    int time;
} ActivarSalidaParams;

void rtc_config_init(void);
char* https_request(void);
void activar_salida(ActivarSalidaParams *params);

#endif