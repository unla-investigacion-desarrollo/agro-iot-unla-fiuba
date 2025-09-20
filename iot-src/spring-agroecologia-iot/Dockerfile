FROM maven:3.6.3-openjdk-17-slim AS build
WORKDIR /home/app
COPY src /home/app/src
COPY pom.xml /home/app
RUN mvn -f /home/app/pom.xml -DskipTests package

FROM openjdk:20-ea-13-jdk-oraclelinux8
WORKDIR /app
RUN mkdir -p /app/logs
COPY --from=build "home/app/target/agroecologia-iot-*.jar" "app.jar"
ENTRYPOINT ["java", "-jar", "app.jar"]