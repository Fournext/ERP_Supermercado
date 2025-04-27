# Etapa 1: Build con Maven y Java 21
FROM maven:3.9.6-eclipse-temurin-21 AS builder

WORKDIR /app

# Copia los archivos del proyecto al contenedor
COPY pom.xml .
COPY src ./src

# Construye el proyecto sin correr tests
RUN mvn clean package -DskipTests

# Etapa 2: Imagen final para ejecutar el .jar
FROM eclipse-temurin:21-jdk-alpine

WORKDIR /app

# Copia el jar generado desde el contenedor anterior
COPY --from=builder /app/target/*.jar app.jar

# Expón el puerto (ajústalo si usas otro)
EXPOSE 3005

# Comando para ejecutar la aplicación
ENTRYPOINT ["java", "-jar", "app.jar"]
