
# Production Deployment Guide

## Architecture decision

This application currently uses Spring Data JPA with PostgreSQL. MongoDB Atlas is not a drop-in deployment target: moving to MongoDB would require replacing JPA entities, repositories, queries, schema behavior, and transaction assumptions. Production deployment therefore uses managed PostgreSQL. MongoDB Atlas remains a future migration option, not a configuration step.

## 1. Prepare secrets

Generate a unique JWT secret of at least 32 bytes for each environment. Do not commit real values. Copy the environment variable names from `backend/.env.example` and `frontend/.env.example` into the deployment provider dashboards.

Required backend values:

- `SPRING_PROFILES_ACTIVE=prod`
- `DB_URL` with PostgreSQL SSL enabled
- `DB_USERNAME`
- `DB_PASSWORD`
- `APP_CORS_ALLOWED_ORIGINS` set to the exact Vercel origin
- `JWT_SECRET`
- `JWT_EXPIRATION_MS`

Required frontend value:

- `VITE_API_URL=https://<backend-host>/api`

## 2. Provision PostgreSQL

Create a managed PostgreSQL database from Render, Railway, or another PostgreSQL provider. Enable SSL, create a least-privilege application user, and restrict network access where the provider supports it. Run migrations or validate the existing schema before setting `JPA_DDL_AUTO=validate`.

The current upload implementation writes files to the local `uploads/` directory. Production containers have ephemeral storage, so use object storage for durable uploads before relying on production image retention. This requires a separate storage implementation and is intentionally outside this configuration-only change.

## 3. Build and deploy the backend

From the repository root:

```bash
cd backend
./mvnw clean package -DskipTests
```

The project targets Java 25, so the build image and local validation environment must use JDK 25. Deploy the resulting jar with the included `backend/Dockerfile`, or configure Render/Railway to run the Maven build and Spring Boot jar directly.

Set the backend environment variables, deploy, and verify the provider logs. The production profile disables SQL output, validates the schema, hides stack traces, and uses structured console logging.

## 4. Deploy the frontend to Vercel

1. Import the repository into Vercel.
2. Set the project root to `frontend`.
3. Set the build command to `npm run build`.
4. Set the output directory to `dist`.
5. Set `VITE_API_URL` to the deployed backend API base URL.
6. Deploy and verify that SPA refreshes resolve through `frontend/vercel.json`.

## 5. Configure CORS and smoke test

Set `APP_CORS_ALLOWED_ORIGINS` to the exact frontend origin, including scheme and host. Do not use `*` with credentials. Verify login, protected dashboard access, citizen complaint submission, image upload, task actions, and staff/report screens from the deployed frontend.

## 6. Database backup strategy

- Enable the provider's automated daily backups and point-in-time recovery where available.
- Retain backups according to the operating policy, for example 30 daily and 12 monthly snapshots.
- Encrypt backups and restrict restore permissions.
- Perform a quarterly restore into an isolated database.
- Record schema version and application release with each backup.
- Monitor storage, connections, slow queries, failed backups, and restore tests.

## 7. Security review

- Rotate `JWT_SECRET` through the provider secret manager; rotation invalidates existing tokens.
- Keep JWT expiry short in production and require re-login after expiry.
- Keep `/api/auth/**` and `/uploads/**` public only where required.
- Keep dashboard, staff, user, task-management, and report data behind role checks. The current global `anyRequest().authenticated()` rule protects unspecified APIs, but endpoint-level role annotations should be reviewed before exposing new admin pages.
- Use HTTPS at Vercel and the backend provider.
- Restrict CORS to known frontend origins.
- Rotate the committed database password immediately because it was previously present in source configuration.
- Add rate limiting and centralized audit logging at the edge/provider before public launch.

## 8. Performance

The frontend build now splits React, charts, icons, and HTTP dependencies into vendor chunks and disables production source maps. Use Vercel compression and CDN caching for static assets. Add route-level lazy loading when routes are registered; the current routing file was intentionally left unchanged by this setup.
