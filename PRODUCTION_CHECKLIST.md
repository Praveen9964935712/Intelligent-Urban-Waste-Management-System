# Production Checklist

## Frontend

- [ ] Set `VITE_API_URL` in Vercel.
- [ ] Run `npm ci` and `npm run build`.
- [ ] Verify Vercel SPA rewrites on direct route refresh.
- [ ] Confirm browser requests use HTTPS and the deployed API URL.
- [ ] Confirm 401 responses clear stale client tokens.
- [ ] Check bundle sizes and Vercel build output.

## Backend

- [ ] Run with `SPRING_PROFILES_ACTIVE=prod`.
- [ ] Set `DB_URL`, `DB_USERNAME`, and `DB_PASSWORD` in the provider secret manager.
- [ ] Set `JWT_SECRET` to a random environment-specific value.
- [ ] Set `JWT_EXPIRATION_MS` to the approved production lifetime.
- [ ] Set `APP_CORS_ALLOWED_ORIGINS` to the exact frontend origin.
- [ ] Confirm `JPA_DDL_AUTO=validate` after schema deployment.
- [ ] Confirm SQL statements, stack traces, and secrets are absent from logs.
- [ ] Add a provider health check and alert on restart loops.
- [ ] Confirm HTTPS, forwarded headers, and secure database SSL.

## Security

- [ ] Rotate the database password previously committed in local configuration.
- [ ] Verify admin-only dashboard, staff, user, and analytics APIs.
- [ ] Verify citizen ownership checks for citizen complaint/profile APIs.
- [ ] Verify task-management and staff-management APIs are not exposed to unprivileged roles.
- [ ] Test expired, malformed, and missing JWTs.
- [ ] Confirm CORS rejects unknown origins.
- [ ] Add edge rate limiting and API monitoring.

## Database and storage

- [ ] Provision managed PostgreSQL, not MongoDB, for the current JPA application.
- [ ] Enable encrypted automated backups and point-in-time recovery.
- [ ] Test a restore into an isolated environment.
- [ ] Move local filesystem uploads to durable object storage before production use.
- [ ] Monitor connections, disk, backups, slow queries, and errors.

## Release smoke test

- [ ] Login as admin.
- [ ] Login as citizen.
- [ ] Load dashboards and reports.
- [ ] Submit a complaint with an image.
- [ ] Verify complaint assignment and status updates.
- [ ] Verify staff and task management actions.
- [ ] Verify CSV, Excel, and PDF report exports.
