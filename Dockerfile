# ============================================================
#  Stage 1 — Build với Maven
# ============================================================
FROM maven:3.9.6-eclipse-temurin-17 AS builder

WORKDIR /app

# Copy pom.xml trước để cache layer dependency
COPY pom.xml .
RUN mvn dependency:go-offline -q

# Copy toàn bộ source rồi build
COPY src ./src
RUN mvn clean package -DskipTests -q

# ============================================================
#  Stage 2 — Runtime image nhẹ
# ============================================================
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Tạo user không phải root để chạy app
RUN addgroup -S spring && adduser -S spring -G spring

# Copy jar từ stage build
COPY --from=builder /app/target/*.jar app.jar

# Đổi owner
RUN chown spring:spring app.jar

USER spring

EXPOSE 8080

# Tối ưu JVM cho container
ENTRYPOINT ["java", \
  "-XX:+UseContainerSupport", \
  "-XX:MaxRAMPercentage=75.0", \
  "-Djava.security.egd=file:/dev/./urandom", \
  "-jar", "app.jar"]
