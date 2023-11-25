# agroecologia-iot

El proyecto consta de:
- MySQL
- NodeJS
- Spring Java (para ver la documentación ir a /swagger-ui/index.html)
- React

Si es la primera que vez que se corre el proyecto, primero, se tiene que ir a la carpeta node y correr el comando:
npm install

Luego, todos estos se levantan con docker utilizando el siguiente comando desde la carpeta raíz (iot-src):
docker compose up

Para esto, es necesario constar con un .env al mismo nivel que el docker-compose.yml con el siguiente contenido:
(Nota: los valores entre llaves {} se tiene que definir por el usuario que hace el deploy de la plataforma)

MYSQLDB_DOCKER_PORT=3306
MYSQLDB_DATABASE=agro_iot
MYSQLDB_USER= {Usuario de MySQL}
MYSQLDB_ROOT_PASSWORD= {Password de MySQL}
MYSQLDB_LOCAL_PORT= {Usuario de MySQL}
NODE_DB_HOST=mysqldb

NODE_MQTT_CLIENT_ID= {id cliente MQTT}
NODE_MQTT_USER= {user cliente MQTT}
NODE_MQTT_PASS= {pass cliente MQTT}
NODE_MQTT_SERVER=mqtt:{dirección IP donde corre el server de MQTT}

#Node config
NODE_PORT= {puerto de Node}
NODE_PATH=/iothuertas

#Spring config
SPRING_PORT= {puerto de Spring}
SPRING_PATH=/iothuertas/
CORS_CONFIG_REACT_SERVER_URL_AND_PORT= {URL y puerto de React}

#React config
PORT= {puerto de React} #React Port
REACT_APP_API_URL= {URL y puerto de Spring}
REACT_APP_PATH=/iothuertas
