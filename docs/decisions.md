# Decisions log

| # | Date | Decision | Why |
| - | ---- | -------- | --- |
| 1 | 2026-11-10 | Monorepo at `infocare-Git/apple` with app/, console/, supabase/, content/, docs/ | As in the brief; chosen by the product owner |
| 2 | 2026-11-10 | Development uses a **hosted Supabase project**, not local Docker | Product owner's choice; Docker isn't running on the dev machine |
| 3 | 2026-11-10 | Flutter stable SDK installed at `D:\dev\flutter`. Milestone 1 screenshots come from a Flutter **web** build | No Android SDK yet; it's needed by Milestone 7 (release build, low-end device testing) |
| 4 | 2026-11-10 | Bikram Sambat dates and Devanagari numerals use the `nepali_utils` package | A tested library, so no custom calendar maths |
| 5 | 2026-11-10 | OTP SMS, Claude, speech and payments stay **mocked** until providers are chosen | SMS costs money per message, so the provider choice belongs to the product owner |

## Open questions for the product owner
- Sell flow: the brief lists about 8 inputs, which conflicts with "three taps or fewer". Proposal for Milestone 6: a step-by-step picture wizard that pre-fills from the farmer's last listing.
- Which Nepali SMS aggregator for OTP, and who pays for messages.

## 2026-11-11

| # | Date | Decision | Why |
| - | ---- | -------- | --- |
| 6 | 2026-11-11 | **Phase 1 is a mobile-first web app** in `web/` on Vercel. Flutter, console and Supabase move to phase 2 | Product owner's request: ship the web version first |
| 7 | 2026-11-11 | Phase 1 keeps each farmer's data on their own phone (localStorage) with client UUIDs | No shared backend yet; UUIDs make the later upload to Supabase idempotent |
| 8 | 2026-11-11 | Text-bearing red is `#A51F1F`, not the brief's `#C62828`. Green fills with text use `#1B5E20` | White on `#C62828` is 5.6:1 and white on `#2E7D32` is 5.1:1, below the brief's 7:1 rule. The brand red stays in the logo and theme colour. A test checks every pair |
| 9 | 2026-11-11 | **Sell flow simplified**: one picture question per screen; repeat sellers start on a pre-filled review screen (1 tap to list) | Resolves the conflict with "three taps or fewer" |
| 10 | 2026-11-11 | Seed chemicals have **no dose or pre-harvest interval**; the app shows "pending expert review" | Safety rule: never invent a dose. Tests enforce it |
| 11 | 2026-11-11 | Ask answers by retrieval over approved articles only; replies "I don't know" below a match threshold | Safety rule; phase 2 puts Claude behind the same retrieval |
| 12 | 2026-11-11 | Weather uses Open-Meteo directly from the browser | Free, no key, so no secret in the app |
| 13 | 2026-11-11 | Bikram Sambat table copied from `nepali_utils` (MIT), checked against 1 Baisakh 2081/2082 | Tested data instead of hand-typed calendar |
