# Security policy

## Reporting a vulnerability

Please do not open a public issue for security problems. Use GitHub's private reporting instead:
**Security tab → Report a vulnerability** on this repository. We aim to respond within a few days.

## What is in scope

- The website in `web/` (including its security headers and dependencies)
- The Sanity Studio configuration in `studio/`

## How the repository is protected

- `main` only accepts changes through pull requests with an approving review and passing checks
- Secret scanning and push protection are enabled
- Dependabot opens weekly update PRs; CodeQL scans every PR
- Secrets (such as `INSTAGRAM_ACCESS_TOKEN`) live in Vercel environment variables, never in git
