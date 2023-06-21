/*
 * config.h
 */

#ifndef CONFIG_EXAMPLE_H
#define CONFIG_EXAMPLE_H

typedef struct
{
	char urlPublish_example[50];
	char urlSubscription_example[50];
	char wifiSSID_example[50];
	char wifiPass_example[50];
	char brockerUri_example[50];
	char mosquittoUserName_example[50];
	char mosquittoUserPassword_example[50];

}project_config_t_example;

extern project_config_t_example projectConfig_example;

void configInit_example(void);



#endif /*CONFIG_H */
