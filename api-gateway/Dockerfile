# ── Stage 1: Build ─────────────────────────────────
# Use Maven to build the JAR
FROM maven:3.9.6-eclipse-temurin-17 AS builder

# Set working directory inside container
WORKDIR /app

# Copy pom.xml first (Docker layer caching)
# If pom.xml hasn't changed, Maven deps won't re-download
COPY pom.xml .
RUN mvn dependency:go-offline -q

# Copy source code
COPY src ./src

# Build the JAR, skip tests (already run in CI)
RUN mvn clean package -DskipTests -q

# ── Stage 2: Run ───────────────────────────────────
# Use lightweight JRE image (not full JDK)
# This makes the final image much smaller (~200MB vs ~600MB)
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Copy only the JAR from builder stage
COPY --from=builder /app/target/*.jar app.jar

# Expose the service port
EXPOSE 8080

# Run the JAR
ENTRYPOINT ["java", "-jar", "app.jar"]
