# Eduwell Backend New

Separate Spring Boot backend for the frontend app.

## Run

1. Update MySQL credentials in `src/main/resources/application.properties`.
2. Create database: `eduwell_db`.
3. Run:

```bash
mvn spring-boot:run
```

The app starts at `http://localhost:8081`.
The app starts at `http://localhost:8080`.

## Optional Email Setup For Submission Notifications

Submission success emails are disabled by default.

Set these environment variables before running the app:

- `MAIL_HOST`
- `MAIL_PORT`
- `MAIL_USERNAME`
- `MAIL_PASSWORD`

Then enable mail in `src/main/resources/application.properties`:

```properties
app.email.enabled=true
```
