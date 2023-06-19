#include "config_example.h"
#include <string.h>
project_config_t_example projectConfig;

void configInit_example(void)
{
	strcpy(projectConfig.wifiSSID_example,"Your wifi SSID");
	strcpy(projectConfig.wifiPass_example,"Your wifi pass");
	strcpy(projectConfig.brockerUri_example,"Your Mosquitto Brocker uri");
	strcpy(projectConfig.mosquittoUserName_example,"Your Mosquitto Brocker username");
	strcpy(projectConfig.mosquittoUserPassword_example,"Your Mosquitto Brocker password");
}


