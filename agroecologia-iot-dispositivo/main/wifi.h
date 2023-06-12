#ifndef WIFI_H
#define WIFI_H



void wifi_init_sta(char * ssid, char * pass);
void wifi_wait_connected(void);
int wifi_is_connected(void);

#endif
