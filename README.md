# YumQuick

YumQuick is a food delivery app for iOS, Android and the web, built with Expo and React Native. You browse dishes from nearby kitchens, customize them, pay, and follow the order to your door.

## What you can do

- **Browse:** search, five categories (Snacks, Meal, Vegan, Dessert, Drinks), best sellers, promotions and recommendations.
- **Filter:** by category, minimum rating, dish type and maximum price.
- **Customize:** pick add-ons and quantity on any dish, and save favorites.
- **Check out:** a slide-in cart, delivery address, payment method, then order confirmation.
- **Track:** see the delivery route and each step from "accepted" to "delivered".
- **Manage orders:** cancel active orders with a reason, review completed ones, or order them again.
- **Account:** profile, saved addresses, cards and wallets, notification settings, password, and a help center with FAQs and contact options.

## Tech stack

- Expo SDK 58 with Expo Router (file-based routes in `src/app/`)
- React Native 0.88, React 19
- `react-native-svg` for the icon set, `expo-image` for photos
- League Spartan font via `@expo-google-fonts/league-spartan`
- Reanimated for drawer, list and status-screen motion

## Project structure

```
src/
  app/
    (auth)/        login, sign up, set password, fingerprint
    (app)/         everything behind login, with the bottom tab bar
    index.tsx      launch screen
    welcome.tsx    log in / sign up choice
    onboarding.tsx
  components/      UI kit, icons, cart and profile drawers, map
  data.ts          menu, addresses, cards, FAQs (mock data)
  store.tsx        app state: cart, favorites, orders, user
  theme.ts         colors, fonts, radii
```

## Getting started

```bash
npm install
npx expo start
```

Then press `i` for the iOS simulator, `a` for Android, `w` for the web, or scan the QR code with Expo Go. Every native module the app uses is included in Expo Go, so you don't need a custom build.

If code changes don't show up, restart with a clean cache: `npx expo start --clear`.

## Status

- All data is local mock data and resets when the app restarts. There is no backend yet.
- Login accepts any email with a password of at least 6 characters.
- Food photos load from Unsplash.

## Scripts

| Command | What it does |
|---|---|
| `npx expo start` | Start the dev server |
| `npx expo lint` | Lint |
| `npx tsc --noEmit` | Typecheck |
