idf_component_register(SRCS "config.c" "main.c"
							 "adc/ads1115/ads1115.c"
							 "sensors/dht22/dht22.c"
							 "sensors/soil_moisture/soil_moisture.c"
							 "timed_outputs.c"
							 "wifi.c"
							 "data_transmitter.c"
                    INCLUDE_DIRS "")

