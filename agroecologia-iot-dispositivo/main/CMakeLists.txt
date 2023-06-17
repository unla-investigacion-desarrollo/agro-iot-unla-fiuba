idf_component_register(SRCS "main.c" 
							 "adc/ads1115/ads1115.c"
							 "sensors/dht22/dht22.c"
							 "sensors/soil_moisture/soil_moisture.c"
							 "timed_outputs.c"
							 "wifi.c"
							 "config.c"
							 "data_transmitter.c" 
							 "sensors/mock/mock_sensor.c"
                    INCLUDE_DIRS "")

