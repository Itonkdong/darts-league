FROM eclipse-temurin:17-jdk as build

WORKDIR /app

# Copy maven wrapper and pom.xml
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .

# Make the maven wrapper executable
RUN chmod +x ./mvnw

# Download dependencies
RUN ./mvnw dependency:go-offline -B

# Copy source code
COPY src src

# Build the application
RUN ./mvnw package -DskipTests

# Runtime stage
FROM eclipse-temurin:17-jre

WORKDIR /app

# Copy the jar file from the build stage
COPY --from=build /app/target/*.jar app.jar

# Create directory for uploads
RUN mkdir -p /app/uploads/winner_photos
RUN mkdir -p /app/uploads/player_photos

# Copy starter photos
COPY --from=build /app/src/main/resources/init/spring-init/player_photos/*.png /app/uploads/player_photos/
COPY --from=build /app/src/main/resources/init/spring-init/winner_photos/*.png /app/uploads/winner_photos/

# Set the upload directory as a volume
VOLUME /app/uploads

# Expose port 8080
EXPOSE 8080

# Set the entrypoint
ENTRYPOINT ["java", "-jar", "app.jar"]
