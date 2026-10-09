# Values-Aligned Social Media Scorer (PWA) — Handoff

Local-first installable PWA (converted from an MV3 Chrome extension). No backend; all data in IndexedDB; the user
supplies their own AI API key and the app will call the provider directly.

## Status

| Area | State |
|---|---|
| Vite + React + TS standard build (no crxjs) | Done, `npm run build` passes |
| Web manifest, icons (placeholder art), iOS meta tags | Done |
| Service worker (offline app shell, build-time precache list) | Done, **not yet tested on a real device** |
| Install UX (`beforeinstallprompt` + iOS Add-to-Home-Screen hint) | Done |
| Mobile UI: tab bar, safe-area insets, 44px targets, offline banner | Done |
| IndexedDB layer (`src/db`) | Done, tested with fake-indexeddb |
| Values quiz (10 values, 1–5) | Done, first-run gate |
| Dashboard | Placeholder Chart.js bar chart (posts analyzed per day) |
| **Manual post input + AI scoring** | **Not started** |
| Facebook integration | Removed (content script). Manual paste is the planned path. |

## Run / test

```
npm install
npm run dev          # http://localhost:5173 (service worker is only registered in production builds)
npm run build        # typecheck + build to dist/ (sw.js gets its precache list injected)
npx vite preview     # serve dist/ to test install + offline
npm test             # vitest (db)
node scripts/make-icons.mjs   # regenerate placeholder icons
```

Installability requires HTTPS (or localhost). To test on a phone, deploy `dist/` to any static host (relative `base`,
hash routing, so no rewrites needed) and open it in Safari/Chrome.

## Layout

```
index.html                 entry; manifest + apple meta tags
public/manifest.webmanifest, public/sw.js, public/icons/
vite.config.ts             react plugin + precache-manifest plugin (rewrites dist/sw.js)
src/main.tsx               mount, SW registration, storage.persist()
src/app/                   App (hash router + tab bar), Home, Quiz, Dashboard, Settings, InstallCard
src/pwa/pwa.ts             SW registration, useInstall, useOnline
src/db/index.ts            idb wrapper: settings + posts stores, day summary
src/shared/                types.ts, values.ts
tests/db.test.ts
```

## Design decisions

- **Service worker only touches same-origin GETs.** Cross-origin AI calls pass straight through. Navigations are
  network-first (deploys show up), assets cache-first (hashed names). Cache name embeds a content hash, so each build
  invalidates the old cache on activate.
- **Hash routing** (`#/home`, `#/settings`, …) so any static host works inside the installed app.
- **Privacy:** only a 280-char snippet and author are stored per post. API key sits in plaintext IndexedDB (document
  this to users). "Delete all data" wipes both stores and reloads to first-run.
- **Facebook:** a PWA cannot inject into other sites, and facebook.com sends `X-Frame-Options`, so iframe embedding will
  not work. Options are manual paste, or the OS Web Share Target (add `share_target` to the manifest so Facebook's share
  sheet can send text/URLs to the app — works on Android Chrome, not iOS Safari).

## Next steps

1. Test install + offline on a real iOS and Android device (Lighthouse PWA audit too).
2. Replace placeholder icons.
3. Manual input screen: paste text → score. Pipeline: build prompt from `valuesVector`, call provider `fetch`
   (Anthropic needs `anthropic-dangerous-direct-browser-access: true` + `x-api-key`; OpenAI uses `Authorization: Bearer`),
   require strict JSON `{alignment_score, brief_reason}`, validate, store. Handle 401/429 with backoff; per-day cap.
   Verify both providers allow browser CORS from the deployed origin.
4. Web Share Target for one-tap sharing from Facebook.
5. Real dashboard (per-value breakdown, trends).

## Known issues

- Not a git repository; no history of the pre-PWA extension code (content script / background worker were deleted).
- iOS evicts site data after ~7 days of non-use for non-installed sites; installing to the Home Screen avoids this.
  `storage.persist()` is requested best-effort.
