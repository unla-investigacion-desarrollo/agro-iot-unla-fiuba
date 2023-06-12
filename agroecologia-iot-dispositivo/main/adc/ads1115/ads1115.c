#include "ads1115.h"
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "esp_system.h"
#include "driver/i2c.h"

#define I2C_MASTER_TIMEOUT_MS 1000

typedef enum
{
		CONV_REG,
		CONF_REG,
		LO_THRESH_REG,
		HI_THRESH_REG
}ads_reg_t;

ads1155_t * ads1115Init(uint8_t i2cPort, uint8_t addr, uint8_t sdaPin, uint8_t sclPin)
{
    ads1155_t * pAds1115 = malloc(sizeof(ads1155_t));
    pAds1115->i2cPort = i2cPort;
    pAds1115->addr = addr;
    pAds1115->sdaPin =sdaPin;
    pAds1115->sclPin =sclPin;
    gpio_set_direction(sdaPin,  GPIO_MODE_INPUT);
    gpio_set_direction(sclPin,  GPIO_MODE_INPUT);
    return pAds1115;
}

void ads1115Destroy(ads1155_t *pAds1115)
{
	free(pAds1115);
}


void setPointer(ads1155_t * pAds1115,ads_reg_t reg)
{
   i2c_cmd_handle_t cmd = i2c_cmd_link_create();
   i2c_master_start(cmd);
   i2c_master_write_byte(cmd, pAds1115->addr << 1, 1);
   i2c_master_write_byte(cmd, reg, 1);
   i2c_master_stop(cmd);
   i2c_master_cmd_begin(pAds1115->i2cPort, cmd, I2C_MASTER_TIMEOUT_MS / portTICK_RATE_MS);
   i2c_cmd_link_delete(cmd);

}


uint16_t readRegister(ads1155_t * pAds1115)
{
   uint8_t low;
   uint8_t high;
   i2c_cmd_handle_t cmd = i2c_cmd_link_create();
   i2c_master_start(cmd);
   i2c_master_write_byte(cmd, (pAds1115->addr << 1) | 1, 1);
   i2c_master_read_byte(cmd, &high, I2C_MASTER_ACK);
   i2c_master_read_byte(cmd, &low, I2C_MASTER_ACK);
   i2c_master_stop(cmd);
   i2c_master_cmd_begin(pAds1115->i2cPort, cmd, I2C_MASTER_TIMEOUT_MS / portTICK_RATE_MS);
   i2c_cmd_link_delete(cmd);

   return ((uint16_t)high << 8) | low;

}


void writeRegister(ads1155_t * pAds1115, ads_reg_t reg, uint16_t value)
{

   i2c_cmd_handle_t cmd = i2c_cmd_link_create();
   i2c_master_start(cmd);
   i2c_master_write_byte(cmd, pAds1115->addr << 1, 1);
   i2c_master_write_byte(cmd, reg, 1);
   i2c_master_write_byte(cmd, (value >>8)&0xff, 1);
   i2c_master_write_byte(cmd, value&0xff, 1);
   i2c_master_stop(cmd);
   i2c_master_cmd_begin(pAds1115->i2cPort, cmd, I2C_MASTER_TIMEOUT_MS / portTICK_RATE_MS);
   i2c_cmd_link_delete(cmd);

}


double ads1115Read(ads1155_t * pAds1115, uint8_t pin)
{

	 i2c_config_t i2cConf = {
        .mode = I2C_MODE_MASTER,
        .sda_io_num = pAds1115->sdaPin,
        .sda_pullup_en = GPIO_PULLUP_DISABLE,
        .scl_io_num = pAds1115->sclPin,
        .scl_pullup_en = GPIO_PULLUP_DISABLE,
        .master.clk_speed = 400000,
        };

    i2c_param_config(pAds1115->i2cPort,&i2cConf);
    i2c_driver_install(pAds1115->i2cPort, i2cConf.mode,0, 0, 0);



    writeRegister(pAds1115,CONF_REG,0xC383 | (pin << 12));
    setPointer(pAds1115,CONV_REG);
    vTaskDelay(20 / portTICK_PERIOD_MS);
    double value = readRegister(pAds1115);
    i2c_driver_delete(pAds1115->i2cPort);
    return value * (4.096 / 32768);

}


double ads1115GenericRead(void * pAds1115, uint8_t pin)
{
	return ads1115Read(pAds1115, pin);
}

