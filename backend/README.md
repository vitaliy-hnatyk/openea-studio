# OpenEA Studio Backend

Spring Boot + PostgreSQL backend for the OpenEA Studio frontend.

## Stack

- Java 17+
- Spring Boot 3
- Spring Web
- Spring Data JPA
- Spring Security
- PostgreSQL
- Basic Auth by default; JWT can be added later through a bearer-token filter.

## Start PostgreSQL

```bash
cd backend/docker
docker compose up -d
```

Database credentials:

```text
Database: openea
User: openea
Password: openea
Port: 5432
```

## Run backend

```bash
cd backend
./mvnw spring-boot:run
```

If you do not have the Maven wrapper, use installed Maven:

```bash
mvn spring-boot:run
```

Backend runs on:

```text
http://localhost:8080
```

Demo Basic Auth:

```text
Username: admin
Password: admin123
```

## Main API

```text
GET    /api/repository
PUT    /api/repository

GET    /api/applications
POST   /api/applications
PUT    /api/applications/{id}
DELETE /api/applications/{id}

GET    /api/integrations
POST   /api/integrations
PUT    /api/integrations/{id}
DELETE /api/integrations/{id}

GET    /api/capabilities
POST   /api/capabilities
PUT    /api/capabilities/{id}
DELETE /api/capabilities/{id}

GET    /api/technologies
POST   /api/technologies
PUT    /api/technologies/{id}
DELETE /api/technologies/{id}
```

## Example

```bash
curl -u admin:admin123 http://localhost:8080/api/repository
```

## Notes

The frontend still works fully offline with IndexedDB. Use this backend when you want a real multi-user PostgreSQL deployment.
