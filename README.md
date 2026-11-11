# apple: Syau Sathi (स्याउ साथी)

An app for Nepali apple farmers: orchard knowledge, tree diagnosis, inputs delivered to a
collection point, and a buyer for the harvest. Pilot district: Jumla.

| Folder | Contents | Status |
| --- | --- | --- |
| `web/` | **Phase 1: mobile-first web app** (Next.js 15, Tailwind v4), deployed on Vercel | Built |
| `app/` | Flutter Android app | Phase 2 |
| `console/` | Web console for experts, suppliers, buyers and admins | Phase 2 |
| `supabase/` | Shared database, access rules, server functions | Phase 2 |
| `content/` | Articles, images, audio | Seed content lives in `web/src/lib/data` for now |
| `docs/` | Decisions log | |

## Run the web app

```bash
cd web
npm install
npm run dev      # http://localhost:3000
npm test         # 28 tests: safety rules, seed data, Nepali dates, 7:1 contrast
npm run build
```

## Deploy on Vercel

Import `infocare-Git/apple` in Vercel and set **Root Directory = `web`**. The framework is
detected as Next.js. After that, every push to `main` deploys automatically. No environment
variables are needed in phase 1.

## What phase 1 does

- **Onboarding** (8 short picture steps): language, phone + OTP, name and palika/ward, orchard
  size, varieties, farmer group, keep content offline.
- **Home**: this month's crop-calendar task, **live 3-day Jumla weather** (Open-Meteo) with hail,
  frost and heavy-rain alerts, price strip, four shortcuts, status chips.
- **Learn**: 30 articles in 5 topics, filtered by season or this month, read aloud, 3–7 steps,
  month badge, linked actions.
- **Tree doctor**: camera with framing guide, up to 3 photos (compressed on the phone to under
  300 KB), optional voice note, result with confidence and three treatment layers. Low confidence
  goes to an expert automatically. 25-entry symptom browser. Ask: answers come **only** from the
  articles, labelled as AI, and the AI says so when it doesn't know. "I need a person" goes to an
  expert queue.
- **Shop**: 40 products in 5 categories, cart, collection point, alone or group order, cash on
  delivery, four-step tracking, confirm receipt. Restricted products need an expert; banned
  products are never listed. Directory of agrovets, nurseries, banks and more.
- **Sell**: step-by-step picture wizard (pre-filled from the last listing), offers compared to the
  reference price, accept, sale note (phone numbers appear only after acceptance), weight at
  pickup, payment.
- Nepali first with English, Devanagari numerals, Bikram Sambat dates, works offline (service
  worker), floating microphone on every screen.

## What is still mocked or sample data (phase 1)

| Item | Now | Phase 2 |
| --- | --- | --- |
| Data storage | On the phone only (localStorage) | Supabase, shared across users |
| Expert replies, supplier order status, buyer offers | Sample/simulated, labelled "नमूना" | Real consoles |
| Photo diagnosis | **Demo classifier, not a real model** | Claude API / trained model via server function |
| OTP SMS | Demo code `123456` | Nepali SMS aggregator |
| Voice | Phone's built-in speech (Nepali where available) | Nepali speech service, recorded narration |
| Prices | Sample figures | Kalimati market feed |
| Agronomic content, regulatory flags | **PLACEHOLDER**, no doses | Expert-approved |
