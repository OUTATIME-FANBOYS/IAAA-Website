# Security policy

## Reporting a vulnerability

Please do not open a public issue for security problems. Use GitHub's private reporting instead:
**Security tab → Report a vulnerability** on this repository. We aim to respond within a few days.

## What is in scope

- The website in `web/` (including its security headers and dependencies)
- The Sanity Studio configuration in `studio/`

## How the repository is protected

- `main` only accepts changes through pull requests with an approving review from a code owner and passing checks (ruleset "Protect main"); force pushes and deletion are blocked and history stays linear
- Secret scanning and push protection are enabled; Dependabot alerts and security updates are enabled and open weekly update PRs; CodeQL scans every PR; CI fails on critical production dependency advisories
- GitHub Actions workflows run with a read-only token by default
- Secrets (`SANITY_API_WRITE_TOKEN`, `MAILCHIMP_API_KEY`, `TURNSTILE_SECRET_KEY`, `INSTAGRAM_ACCESS_TOKEN`, `CALL_FOR_LEADS_SCRIPT_URL`) live in Vercel environment variables, never in git; `web/.env.example` lists them with empty values

## How the site is hardened

- Security headers on every response (`web/next.config.ts`): Content-Security-Policy, X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy and HSTS; `X-Powered-By` is removed
- Links coming from the CMS or the Instagram API are checked before they are rendered: only `http(s)`, `mailto` and `tel` links are allowed (no `javascript:` or `data:`), "own site" is an exact host match, and external links open with `rel="noopener noreferrer"`
- The site has no user accounts, cookies or API routes. It has three public forms, all server actions that validate on the server, carry a hidden spam-trap field and, once the Cloudflare Turnstile keys are set, verify a Turnstile token (without the secret key the check is skipped, so set both keys in production):
  - **Newsletter** (footer): name, email, phone and zip go straight to Mailchimp as a *pending* contact (double opt-in). Nothing is stored by the site.
  - **Call for leads**: name, email, chosen groups and a note go to a Google Apps Script web app that appends them to a Google Sheet, as URL parameters of a server-to-server request (so they can appear in Google's request logs). The page also shows group sign-up counts and the sign-up names; that is public.
  - **Member profile** (`/join/profile?invite=…`): reachable only with an invite link an admin creates in Studio. It writes an *unpublished draft* member (never a published one), so an admin must review and publish it.
- Sanity access: the production dataset is public read-only (published content only) and the `staging` dataset is private. Invite links are stored as draft-only documents, which the public API cannot read, and the Publish action is removed for them in Studio. The only API token is `SANITY_API_WRITE_TOKEN` (Editor), used server-side by the profile form and set on Production only. CORS allows only the local Studio (with credentials) and local site (without)
- The free Sanity plan has only Administrator and Viewer roles and no private datasets: keep the number of Administrators small, give read-only access as Viewer, and keep personal data (emails, phone numbers) out of Sanity
- Dependency overrides in `web/package.json` and `studio/package.json` pin patched versions of transitive packages; remove an override once the upstream package ships the fix
