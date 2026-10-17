# Sanket Mohanty — engineering portfolio

A complete Next.js App Router portfolio with a private content dashboard, PostgreSQL persistence, and a printable resume. The public site starts without credentials using typed starter content. Database-backed editing and contact persistence fail closed until configured; there is no simulated submission success or public registration.

## Local setup

Use Node.js 24 LTS and npm. On Windows PowerShell, use `npm.cmd` if script execution policy blocks `npm.ps1`.

```sh
npm ci
npm run db:generate
npm run dev
```

Open http://localhost:3000. No external services are needed to view the portfolio, project case studies, or resume. To enable all features, copy `.env.example` to `.env`, configure the variables below, then run:

```sh
npm run db:migrate
npm run db:seed
npm run admin:provision
npm run dev
```

The seed uses stable IDs and skips an existing portfolio. Run it once during initial provisioning, separately from deployments. Never run seed jobs concurrently. Subsequent content updates belong in `/admin`; redeployment never overwrites content.

## Architecture and files

- `src/app`: server-rendered public pages (`/`, `/about`, `/projects`, `/experience`, `/skills`, `/education`, `/contact`), `/projects/[slug]`, `/resume`, protected admin screens, route handlers, sitemap, robots, and social image.
- `src/app/editorial.css`: warm editorial visual system with ivory, forest green, and terracotta, responsive portrait framing, and light/dark themes. Public page motion is limited to brief color transitions.
- `src/components/portfolio-section.tsx`: all original portfolio sections, now presented on dedicated pages. Education retains certifications and publications/achievements. Numbered chapter navigation connects every page; projects show three entries per results page, with search/filter changes returning to page one.
- `src/components`: navigation, responsive project gallery, semantic code-native project illustrations, contact form, theme provider, shadcn-style Button, and Radix dialogs.
- `src/content/portfolio.ts`: typed initial content and a public-only fallback snapshot.
- `src/lib/content-schema.ts`: shared Zod schemas, publication filtering, and privacy-safe serialization.
- `src/features/admin`: reusable content forms, uploads, inbox actions, and login.
- `src/server/auth`: Better Auth server-side sessions and database role checks.
- `src/server/repositories`: normalized Prisma content persistence and transactional child-record replacement.
- `src/server/services`: public content caching, durable rate limiting, contact storage orchestration, and email notifications.
- `prisma`: PostgreSQL schema, version-controlled migration, and idempotent initial seed.
- `scripts`: administrator provisioning/recovery and isolated test fixture preparation.
- `tests`: validation/security/component unit tests, PostgreSQL integration tests, and Playwright browser tests.

Stack: Next.js 16, React 19, strict TypeScript, Tailwind v4, Motion, Radix, Lucide, React Hook Form, Zod, Prisma 7 with the PostgreSQL adapter, Better Auth, Resend HTTP API, Cloudinary signed uploads, optional Sentry server error reporting, Vitest, and Playwright. The lockfile records tested versions. Fonts are packaged locally rather than fetched at runtime. Small brand SVGs are local because current Lucide releases exclude brand icons.

## Environment

`.env.example` contains names only. Never commit `.env`, secrets, production data, or test database files.

| Variable                                                               | Purpose                                                                                                                                                                              |
| ---------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `DATABASE_URL`                                                         | PostgreSQL runtime connection string; use the managed provider's pooled connection where appropriate. Required for contact and admin.                                                |
| `DIRECT_URL`                                                           | Optional direct PostgreSQL connection for migration commands.                                                                                                                        |
| `BETTER_AUTH_SECRET`                                                   | A cryptographically random secret of at least 32 characters. Required for authentication.                                                                                            |
| `BETTER_AUTH_URL`                                                      | Canonical origin, e.g. `http://localhost:3000` locally or your HTTPS production origin.                                                                                              |
| `NEXT_PUBLIC_SITE_URL`                                                 | Same canonical origin, used for SEO, sitemap, and public URLs. The only public environment variable.                                                                                 |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD`                                        | Used only by provisioning/recovery scripts. Password must be 14–128 characters. Remove them from the deployed environment after provisioning.                                        |
| `RESEND_API_KEY`                                                       | Optional notification provider key.                                                                                                                                                  |
| `CONTACT_FROM_EMAIL`                                                   | Sender address on a Resend-verified domain.                                                                                                                                          |
| `CONTACT_TO_EMAIL`                                                     | Private destination for contact notifications.                                                                                                                                       |
| `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | Managed image/PDF upload configuration. Never use a public unsigned upload preset.                                                                                                   |
| `SENTRY_DSN`                                                           | Optional server error monitoring; request and user data are removed, tracing disabled. No visitor analytics are included.                                                            |
| `TRUST_PROXY`                                                          | Set to `true` only behind a trusted reverse proxy that overwrites `X-Forwarded-For`. Vercel uses its platform forwarding header. Otherwise all requests share a conservative bucket. |
| `TEST_DATABASE_URL`                                                    | Dedicated disposable PostgreSQL database whose name ends in `_test`.                                                                                                                 |
| `E2E_ADMIN_EMAIL`, `E2E_ADMIN_PASSWORD`                                | Credentials used exclusively by the isolated browser-test fixture.                                                                                                                   |

Generate secrets with a password manager or `node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"` in your own terminal. Keep `BETTER_AUTH_URL` and `NEXT_PUBLIC_SITE_URL` consistent. No production credentials are supplied.

## Administrator setup and recovery

1. Apply migrations and seed the initial portfolio.
2. Set `ADMIN_EMAIL` and a unique strong `ADMIN_PASSWORD` in your local, ignored environment.
3. Run `npm run admin:provision`, then open `/admin/login`.
4. Remove the provisioning password from the environment and retain it in a password manager.

The provisioner refuses to overwrite an existing account. There is no public sign-up or self-service role change endpoint. To recover an administrator, set its email and a new password locally and run `npm run admin:reset-password`; this revokes existing sessions. Sessions are stored in PostgreSQL, HttpOnly, SameSite=Lax, and Secure on HTTPS. Every protected page read and every write/upload/delete checks the current administrator role on the server. Session role claims are not trusted alone.

## Content editing

`/admin` manages the profile and homepage copy, projects, skills and project associations, experience, certifications, education, publications, social links, resume, and SEO settings. Every collection supports add/edit/delete, draft/published status, and display order. Lower order numbers appear first. Project sections and images can be reordered inside the editor. Deletion asks for confirmation; child project records cascade safely.

Use the asset upload fields for the portrait, resume, cover images, screenshots, and certificate files. Images accept PNG/JPEG/WebP; documents accept PDF, with a 5 MB limit and server-side signature checks. URLs must be local `/images/` or `/documents/` paths or Cloudinary HTTPS assets. PDFs open in a separate tab; Cloudinary may require enabling PDF delivery in its security settings. Uploaded files remain in Cloudinary when records are deleted or replaced, preventing accidental deletion of assets referenced elsewhere. Review and remove unused assets in Cloudinary separately.

Work-related projects have separate switches for repository links and images. KNOI defaults to both disabled. Case-study text must remain non-confidential. Achievements require a verification link before publication. Contact messages can be marked read/unread, archived/restored, or deleted, with 20 messages per page.

Public content is cached for up to 60 seconds and invalidated after admin mutations. A configured but unavailable database produces an error state rather than silently restoring old content. Without `DATABASE_URL`, only the public starter snapshot is served. Drafts, hidden phone numbers, and disabled proprietary links/images are removed before public serialization.

## Content sources and review decisions

- Personal details, education, internship dates, and additional retail-analysis work come from the supplied `Sanket_M_Resume.pdf`. Its original bytes are provided under `public/documents/`.
- The supplied portrait is copied unchanged into `public/images/sanket.png`.
- The owner clarified that KNOI is a work project within Bandhure Solution LLP / Aivi.in, not a separate employer.
- Public repository descriptions were reviewed: [fraud risk scoring](https://github.com/SANKETMOHANTY1304/Fraud-Risk-Scoring-System-using-ML-Algorithms) and [human activity recognition](https://github.com/SANKETMOHANTY1304/Human-Activity-Recognition-using-DL-models). The case studies distinguish repository descriptions and resume claims from reproduced experimental results. No benchmark was reproduced.
- The LinkedIn profile could not be fetched; it is linked using the owner-supplied URL without inferring additional facts.
- ITIL is retained as a draft because issuer/date/verification details were not supplied. The heart-sound project remains a draft pending confirmation. No publications or awards were invented. Phone and personal location are blank by default.
- Project covers are conceptual vector illustrations, not screenshots, measured charts, or proprietary architecture disclosures. Suggested future improvements are explicitly described as potential work.

## Contact and integrations

`POST /api/contact` validates bounded input with Zod, checks request origin, uses a honeypot, and enforces PostgreSQL-backed atomic rate limits (5 requests per client per 15 minutes, plus a site-wide cap). The accepted message is saved before an email notification is attempted. Email failures do not remove it or report that the submission failed; its notification status is visible in the inbox. An unavailable database returns a generic error and the UI offers the direct email link. There is no in-memory or browser-local persistence fallback.

Resend and Cloudinary use server-only secrets and request timeouts. External delivery requires your real accounts and cannot be verified until configured. Sentry is optional. Server logging avoids message bodies, credentials, and database connection strings. Security headers and per-request nonce CSP are provided; inline styles are allowed for React/Motion, while scripts require a nonce. Text is rendered using React escaping, with a separate safe JSON-LD serializer.

## Validation

```sh
npm run lint
npm run typecheck
npm test
npm run build
npm audit --audit-level=high
npx playwright install chromium
npm run test:e2e
```

For the full database suite, create an isolated PostgreSQL database ending in `_test`, set `TEST_DATABASE_URL`, `E2E_ADMIN_EMAIL`, `E2E_ADMIN_PASSWORD`, and `BETTER_AUTH_SECRET`, then:

```sh
npm run test:prepare
npm test
npm run build
npm run test:e2e
```

The fixture migrates and seeds only the named test database and provisions a test administrator. Database tests are explicitly skipped without those settings; they never connect to `DATABASE_URL` as a substitute. Tests cover real contact persistence, email-failure handling, admin login/CRUD/publication, unauthorized access, CSRF, filtering, private-content serialization, mobile navigation, theme persistence, accessibility scans, and overflow at 375, 768, 1024, and 1440 pixels. Browser screenshots are stored in ignored `test-results/`. On Windows, `PLAYWRIGHT_CHANNEL=msedge` can use installed Microsoft Edge. CI provisions disposable PostgreSQL and runs the complete suite.

See `docs/VERIFICATION.md` for the actual executed results. No Lighthouse score is claimed.

## Production deployment (Vercel + managed PostgreSQL)

1. Create your GitHub repository and push this workspace, including the lockfile and migrations. Do not include `.env` or `.local/`. The included GitHub Actions workflow runs CI on pushes and pull requests.
2. Create a managed PostgreSQL database in a region near your Vercel functions. Require TLS and use least-privileged application credentials. Obtain pooled runtime and direct migration connection strings.
3. Import the repository into Vercel using the Next.js preset and Node.js 24. Set `DATABASE_URL`, optional `DIRECT_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, and `NEXT_PUBLIC_SITE_URL` for the intended environment. Keep preview deployments on separate databases.
4. Run `npm run db:migrate` through a trusted deployment job with direct database access. Run `npm run db:seed` only for the first installation. Run `npm run admin:provision` securely outside public request handling.
5. Configure Resend with a verified sending domain and the three email variables. Configure Cloudinary and its three upload variables. Optionally set `SENTRY_DSN`.
6. Deploy with the build command `npm run build`. Database migrations should be a separately controlled release step; builds never seed or mutate content.
7. Add your custom domain in Vercel, update the requested DNS records at the registrar, and wait for Vercel's HTTPS certificate. Update both origin variables to that domain and redeploy. Secure cookies and HSTS apply over HTTPS.
8. Verify `/`, one project, `/resume`, sitemap, login, a test contact message, inbox delivery, and a small asset upload on the deployed origin. Remove the test contact message. Set up monitoring and database backup alerts.
9. Make future content changes in `/admin`; deploy code changes through reviewed commits and CI.

This workspace is prepared for deployment; no GitHub repository, Vercel project, public domain, email account, or storage account has been created or modified by the implementation.

## Backup, recovery, and maintenance

Enable managed daily backups and point-in-time recovery with a retention policy appropriate to your contact data. Back up Cloudinary assets separately. Periodically restore a database snapshot into an isolated environment and verify record counts and a sample project/contact before considering a backup tested. Before a schema change, take a recovery point, apply versioned migrations in staging, and verify a rollback/forward-fix plan. Use `prisma migrate deploy` for releases; do not run `db push` against production.

Choose a retention period for contact messages and delete expired records through a controlled maintenance job. Expired rate-limit rows can be removed with `DELETE FROM "RateLimit" WHERE "expiresAt" < NOW();`; no application content is affected. Monitor failed notification status in the inbox; notifications are not automatically retried. Inbox storage is the source of truth.

## Troubleshooting

- **Admin setup screen:** database/authentication variables are missing. Provision the database and administrator; there are no default credentials.
- **Public error after connecting the database:** apply migrations and run the initial seed. Check provider network access and TLS; configured database errors are not hidden.
- **403 on a form:** canonical origins differ, or a proxy rewrote Origin incorrectly. Fix the canonical URL/proxy rather than disabling origin validation.
- **No notification email:** inspect inbox status, Resend credentials, verified sender, recipient, and provider logs. Stored messages remain available.
- **Upload failure:** check Cloudinary credentials, MIME/signature, size limit, account permissions, and PDF delivery settings.
- **Migration connectivity:** use `DIRECT_URL` for the provider's direct PostgreSQL endpoint, or Supabase's session pooler on port 5432 when IPv6 is unavailable. Runtime connections can use the transaction pooler on port 6543.
- **Supabase TLS:** runtime and migration configuration use the bundled public CA in `config/certs/supabase-ca.crt`, with certificate verification enabled. Transport settings are derived in memory; `.env` credentials are not rewritten. Keep this certificate in deployment artifacts. See `config/certs/README.md` for renewal information.
- **Supabase table access:** migrations enable RLS and revoke browser-role privileges on application tables. Access goes through the Next.js server and Better Auth. The server database role must own these tables or have an appropriate backend RLS policy/bypass role; do not use `anon` or `authenticated` as the Prisma database role.
- **Verify initial admin:** with the provisioning variables still configured, run `node --conditions=react-server --import tsx scripts/verify-auth.ts`. It verifies the stored password hash, sign-in, session persistence, disabled registration, and sign-out without printing credentials. It removes its own test session. `ADMIN_PASSWORD` is only needed for provisioning/recovery/this check, not normal server operation.
- **Windows npm certificate errors:** use the operating system certificate store with `NODE_USE_SYSTEM_CA=1` if your network requires it. Never disable TLS verification.
- **Tests connecting to the wrong database:** tests require an explicit `_test` database URL. Never point tests at production.

Reference documentation: [Next.js](https://nextjs.org/docs/app), [Prisma PostgreSQL](https://www.prisma.io/docs/orm/overview/databases/postgresql), [Better Auth Prisma](https://better-auth.com/docs/adapters/prisma), and [Tailwind Next.js](https://tailwindcss.com/docs/installation/framework-guides/nextjs).
