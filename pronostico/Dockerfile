# Fase de construcción con Maven y JDK 17
FROM maven:3.9.6-eclipse-temurin-17 AS build

# Copiar el archivo pom.xml para descargar las dependencias
COPY pom.xml /home/app/pom.xml

# Crear el directorio de trabajo
WORKDIR /home/app

# Descargar las dependencias sin compilar
RUN mvn dependency:go-offline

# Copiar el código fuente al contenedor
COPY src /home/app/src

# Ejecutar Maven para construir el proyecto y generar el JAR
RUN mvn package -DskipTests

# Fase de ejecución usando OpenJDK 17
FROM eclipse-temurin:17-jre-jammy

# Crea el directorio donde se almacenarán los archivos descargados
RUN mkdir -p /app/downloads

# Copiar el JAR generado desde la fase de construcción
COPY --from=build "/home/app/target/pronostico-0.0.1-SNAPSHOT.jar" "app.jar"

# Comando para ejecutar la aplicación
ENTRYPOINT ["java", "-jar", "/app.jar"]

# inicio codigo viejo
# Fase de construcción con Maven y JDK 17
#FROM maven:3.6.3-openjdk-17-slim AS build

# Copiar el código fuente y el archivo pom.xml al contenedor
#COPY src /home/app/src
#COPY pom.xml /home/app

# Ejecutar Maven para construir el proyecto y generar el JAR
#RUN mvn -f /home/app/pom.xml -DskipTests package
# fin codigo viejo

# docker build -t pronostico-app .
# docker run -p 8080:8080 pronostico-app