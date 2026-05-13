# zeshaq-pages-dev

Source of **https://zeshaq.pages.dev** — blog, platform docs, learning tracks, and a whiteboard tool. Astro 5 + MDX + React islands, deployed to Cloudflare Pages on every push to `main`.

## Contributors: start here

→ **[ONBOARDING.md](./ONBOARDING.md)** — full onboarding and operations manual for humans and AI agents.
→ **[CLAUDE.md](./CLAUDE.md)** — deeper conventions for AI agents.

## Quick start

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # → dist/
```

Build before committing — MDX parse errors only surface at build time.

## Deploy

Pushing to `main` triggers `.github/workflows/deploy.yml` → builds → uploads to Cloudflare Pages project `zeshaq`.
