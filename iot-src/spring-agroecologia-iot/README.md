# agroecologia-iot
Backend en Spring Boot del TFI de Agroecología - UNLa 2022

* Pasos para correr el proyecto localmente

1. Crear una base de datos con el nombre 'agroecologiaiot' en MySQL Workbench.
2. Clonar el proyecto, y modificar el archivo 'application.yml' agregando la configuración local de MySQL.
3. Abrir una terminal y correr el comando 'mvn clean install' para crear las tablas y sus relaciones automáticamente.
4. Una vez creadas las tablas, utilizar el comando 'mvn spring-boot:run' para correr la aplicación.
5. Entrar a http://localhost:8080/swagger-ui/index.html para acceder al Swagger.


