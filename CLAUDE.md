# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Spring Boot 4 REST API for tracking investment portfolios. Uses PostgreSQL, Spring Security with JWT authentication, JPA/Hibernate, Lombok, ModelMapper, and Springdoc OpenAPI.

- Java 21, Spring Boot 4.0.6, Maven
- Base package: `org.ipt.investmentportfoliotrackerapi`
- Source root: `InvestmentPortfolioTrackerAPI/src/main/java/`

## Commands

### Build & Run (local)
```bash
# Run database only
docker compose up db -d

# Build and run the app (requires .env in project root)
cd InvestmentPortfolioTrackerAPI && ./mvnw spring-boot:run

# Build JAR (skip tests)
cd InvestmentPortfolioTrackerAPI && ./mvnw clean package -DskipTests
```

### Run with Docker
```bash
docker compose up --build
```

### Tests
```bash
# Run all tests
cd InvestmentPortfolioTrackerAPI && ./mvnw test

# Run a single test class
cd InvestmentPortfolioTrackerAPI && ./mvnw test -Dtest=InvestmentPortfolioTrackerApiApplicationTests
```

## Architecture

### Layered structure
```
controller/   → REST endpoints (@RestController)
service/      → Business logic (@Service)
repository/   → Spring Data JPA repositories
data/
  model/      → JPA entities (User, Account, Transaction, Company)
  dto/        → Data transfer objects
  enums/      → AuthenticationType, TransactionType
config/       → Spring beans (ApplicationConfig, SecurityConfig, SwaggerConfig)
filter/       → JwtAuthenticationFilter (servlet filter)
```

### Domain model
- `User` → has many `Account`s (via `user_id` FK)
- `Account` → has many `Transaction`s (via `account_id` FK)
- `Transaction` → references one `Company` (via `company_id` FK)

### Authentication flow
1. `POST /api/auth/register` and `POST /api/auth/login` are public (no JWT required).
2. All other endpoints require a `Bearer <token>` header.
3. `JwtAuthenticationFilter` validates the token on every request and sets the `SecurityContext`.
4. `JwtService` signs/verifies tokens with an HMAC-SHA key from `SECRET_KEY` env var.
5. `UserDetailsService` (in `ApplicationConfig`) loads users by email from the DB.

### Configuration
Environment variables are loaded from `.env` at the project root (via `spring.config.import=optional:file:.env[.properties]`):

| Variable | Purpose |
|---|---|
| `SPRING_DATASOURCE_URL` | JDBC URL (local: `jdbc:postgresql://localhost:5433/investment_portfolio`) |
| `SPRING_DATASOURCE_USERNAME` | DB username |
| `SPRING_DATASOURCE_PASSWORD` | DB password |
| `SECRET_KEY` | Base64-encoded HMAC secret for JWT |
| `EXPIRATION_TIME` | JWT TTL in milliseconds |

Docker Compose maps host port **5433** → container port **5432** to avoid conflicts with a local Postgres instance.

### Swagger UI
Available at `http://localhost:8080/swagger-ui/index.html` when the app is running. The `/v3/api-docs/**` and `/swagger-ui/**` paths are whitelisted in `SecurityConfig`.

### ModelMapper
`ModelMapper` (bean in `ApplicationConfig`) is used throughout services to convert between entities and DTOs. When adding new entity↔DTO mappings with non-trivial field name differences, configure explicit mappings on the `ModelMapper` bean rather than relying on automatic matching.

### DDL
`spring.jpa.hibernate.ddl-auto=update` — Hibernate auto-updates the schema on startup. There are no migration scripts; schema changes are applied automatically.