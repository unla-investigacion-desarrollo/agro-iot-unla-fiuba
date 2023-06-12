#ifndef MOCK_SENSOR_H
#define SENSOR_H


typedef struct
{

	double value;

}mock_sensor_t;


mock_sensor_t * mockSensorInit(double value);
void mockSensorDestroy(mock_sensor_t * pMocksensor);
double mockSensorRead(mock_sensor_t * pMocksensor);
void mockSensorGenericRead(void * pMocksensor, char * buffer, int bufflen);



#endif
