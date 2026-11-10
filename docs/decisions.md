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
