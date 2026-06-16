FROM maven:3.8.4-openjdk-17-slim AS build
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline
COPY src ./src
RUN mvn clean package -DskipTests

FROM openjdk:17-jdk-slim
WORKDIR /app
COPY --from=build /app/target/blog-service-0.0.1-SNAPSHOT.jar blog-service.jar
EXPOSE 8083
ENTRYPOINT ["java", "-jar", "blog-service.jar"]