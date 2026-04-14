# Ripple

*Small nods. Wide ripples.*

A campus connection app built in a one-hour solo hackathon. Ripple reveals the invisible social graph already forming around your seat, and uses Claude to gently introduce you to the people you have been sitting near — or the people most worth meeting across difference.

## What it does

- **Seat Archaeology.** Shows how often you have shared a lecture room with each candidate.
- **Anti-Resume.** Matches on one struggle, one failure, one curiosity — not polished credentials.
- **Bridge Mode.** Toggle between Similarity (people like you) and Bridge (people unlike you, one shared spark).
- **Warm Introducer.** Claude writes a personalized intro message tailored to your communication style (text-first vs meet-first).
- **Time-Locked Reveals.** Displays shared-lecture counts so connections feel earned.
- **Group-First Matching.** Matches 2-3 people from the same lecture, not 1-to-1.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Demo

The app runs entirely in the browser as a static export.

- **Demo Mode** (default): uses pre-written Claude-style responses. No API key needed.
- **Live Mode**: paste an Anthropic API key in the bar at the top. The browser calls Claude directly using `dangerouslyAllowBrowser`. The key is stored only in your `localStorage` — never committed.

## Deploy to GitHub Pages

This repo ships with a GitHub Actions workflow at `.github/workflows/deploy.yml`. Enable Pages in the repo settings (Source: GitHub Actions), push to `main`, and it will publish to `https://<user>.github.io/Claude-Hack-Team30-2026/`.

If you rename the repo, update the `repo` constant in `next.config.js`.

## Stack

- Next.js 14 (App Router, static export)
- React + TypeScript
- Tailwind CSS
- Anthropic TypeScript SDK (browser-direct, with prompt caching on system prompts)

See [DESIGN.md](DESIGN.md) for the product design.
