# YumQuick

Food delivery app (Expo / React Native, iOS + Android + web). Register: **product** — the design serves ordering, not the other way round.

## Who and where
Hungry people on their phone, often one-handed, between other things: on the couch, on a lunch break, in a hallway waiting for the courier. Daylight or warm indoor light. They want to pick something, pay, and know when it arrives — fast.

## Voice
Warm, quick, appetizing. Short sentences, plain words, no exclamation spam. Errors say what to do next ("Use MM/YY for the expiry date"), never just "Invalid".

## Core flows
1. Launch → onboarding → log in / sign up (fingerprint optional)
2. Home → category / search / promo → dish → add-ons → cart drawer → confirm → pay → confirmed → track
3. My Orders: active (cancel, track) · completed (review, order again) · cancelled
4. Account drawer: profile, addresses, payment methods, contact, FAQ, settings, log out

## Constraints
- Source of truth for layout is the mockups in `docs/app-images/`.
- Data is local mock data (`src/data.ts`) with in-memory state (`src/store.tsx`); no backend yet.
