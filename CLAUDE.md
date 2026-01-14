# Project: Trading Agenda

## Overview
React Native mobile app for ICT-style trading journaling with session alerts, analytics, and rules tracking.

## Tech Stack
- **Framework:** React Native + Expo (managed)
- **Language:** TypeScript
- **Storage:** SQLite (expo-sqlite)
- **State:** Zustand
- **Navigation:** React Navigation
- **Environment:** Fedora Linux / Fish Shell

## Commands

### Development
```bash
npx expo start         # Start dev server
npx expo start --android  # Launch Android emulator
npx expo start --ios      # Launch iOS simulator (macOS only)
npm run web              # Web preview
```

### Build
```bash
npx tsc --noEmit        # Type check
eas build --platform android  # Production Android build
eas build --platform ios      # Production iOS build
```

## Project Structure
```
src/
├── screens/       # Tab screens (Home, Journal, Analytics, Alerts, Rules)
├── components/    # Reusable UI components
├── lib/           # Database, notifications, utilities
├── stores/        # Zustand state (trades, alerts, rules)
├── types/         # TypeScript definitions
├── constants/     # Sessions, default alerts/rules
└── navigation/    # Tab navigator
```

## Key Files
- `src/lib/database.ts` - SQLite CRUD operations
- `src/stores/tradeStore.ts` - Trade state and analytics
- `src/constants/defaultAlerts.ts` - Pre-seeded time windows
- `src/constants/defaultRules.ts` - Pre-seeded trading rules

## State Recovery
On start, read `docs/project-status.md` and `docs/decision-log.md`.

## Sync Command
`/update-docs-and-commit` - Update docs and commit changes
