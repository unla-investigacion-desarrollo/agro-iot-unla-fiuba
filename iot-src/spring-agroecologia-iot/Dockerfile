FROM maven:3.6.3-openjdk-17-slim AS build
COPY src /home/app/src
COPY pom.xml /home/app
RUN mvn -f /home/app/pom.xml -DskipTests package

FROM openjdk:20-ea-13-jdk-oraclelinux8
COPY --from=build "home/app/target/agroecologia-iot-0.0.1-SNAPSHOT.jar" "app.jar"
ENTRYPOINT ["java", "-jar", "/app.jar"]