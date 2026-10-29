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
- Secrets (such as `INSTAGRAM_ACCESS_TOKEN`) live in Vercel environment variables, never in git

## How the site is hardened

- Security headers on every response (`web/next.config.ts`): Content-Security-Policy, X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy and HSTS; `X-Powered-By` is removed
- Links coming from the CMS or the Instagram API are checked before they are rendered: only `http(s)`, `mailto` and `tel` links are allowed (no `javascript:` or `data:`), "own site" is an exact host match, and external links open with `rel="noopener noreferrer"`
- The site has no forms, cookies, user accounts or API routes, so there is no user data to protect
- The Sanity project has no API tokens; the production dataset is public read-only (published content only), the `staging` dataset is private, and CORS allows only the local Studio (with credentials) and local site (without)
- Dependency overrides in `web/package.json` and `studio/package.json` pin patched versions of transitive packages; remove an override once the upstream package ships the fix
