FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn -B -ntp dependency:resolve-plugins dependency:resolve
COPY src ./src
RUN mvn -B -ntp clean package -DskipTests

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/target/contact-service-0.0.1-SNAPSHOT.jar contact-service.jar
EXPOSE 8084
ENTRYPOINT ["java", "-jar", "contact-service.jar"]
