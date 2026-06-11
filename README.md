# 24-Hour Stories

An ephemeral "Stories" feature in the style of Instagram and WhatsApp, built as a
**fully client-side** web app. Upload a photo, it appears as a story, and it
automatically disappears 24 hours after it was posted — no backend, no accounts, no
network calls. Everything lives in the browser.

## Features

- **Post a story** — pick an image; it's resized, compressed, and added to the story row.
- **Auto-expiry** — every story vanishes 24 hours after upload, both on load and live via
  a background sweep (no refresh needed).
- **Full-screen viewer** — Instagram-style with timed, auto-advancing progress bars.
  Navigate with on-screen arrows, tap zones, swipe, or arrow keys; pause/resume with a
  button, the spacebar, or press-and-hold.
- **Unseen indicator** — a lavender gradient ring marks unseen stories and fades once viewed.
- **Manual delete** — remove a story before its 24 hours are up.
- **Responsive** — works from mobile to desktop; portrait and landscape images fit cleanly.

## How it works

This is a front-end-only project; there is no server.

- **Persistence** — stories are saved in `localStorage` (key `stories:v1`). Each record
  carries its own `createdAt` / `expiresAt`, and expired entries are pruned on load and on
  a 30-second interval.
- **Image handling** — uploads are drawn to a `<canvas>`, downscaled to fit within
  **1080 × 1920** (aspect-ratio preserved, never upscaled), and stored as a compressed
  base64 JPEG. This keeps each image to tens of KB, well within the browser's storage budget.
- **No external storage** — because images are inlined as base64, there's no file server or
  CDN involved.

## Tech stack

- [Next.js 16](https://nextjs.org) (App Router) + [React 19](https://react.dev)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS v4](https://tailwindcss.com/) — tokens defined via `@theme` in `app/globals.css`

The UI follows a dark "Linear" design language documented in [`DESIGN.md`](./DESIGN.md).

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Production build (also type-checks) |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |

## Project structure

```
app/          App Router entry (layout, page, global styles + design tokens)
components/   StoryBar, AddStoryButton, StoryThumbnail, StoryViewer, ProgressBars
hooks/        useStories — single source of truth (load/add/delete/expire)
lib/          image (canvas resize/compress), storage (SSR-safe localStorage), time
types/        Story model and constants (TTL, storage key, max dimensions)
```

## Notes & limitations

- Data is per-browser and per-device — there is no sync. Clearing site data removes all stories.
- Storage is bounded by the browser's `localStorage` quota (~5 MB). For larger volumes a
  production version would move to IndexedDB.
