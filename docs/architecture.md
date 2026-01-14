# Trading Agenda - Architecture

## Overview
React Native mobile app for ICT-style trading journaling.

## Tech Stack
- **Framework:** React Native with Expo (managed workflow)
- **Language:** TypeScript
- **Storage:** SQLite (expo-sqlite)
- **State:** Zustand
- **Navigation:** React Navigation (bottom tabs)
- **Notifications:** expo-notifications

## Directory Structure
```
trading-agenda/
├── App.tsx                 # Entry point
├── src/
│   ├── screens/           # Tab screens
│   ├── components/        # Reusable UI components
│   ├── lib/               # Core utilities
│   │   ├── database.ts    # SQLite operations
│   │   ├── notifications.ts # Push notification setup
│   │   └── utils.ts       # Helper functions
│   ├── stores/            # Zustand state stores
│   │   ├── tradeStore.ts
│   │   ├── alertStore.ts
│   │   └── ruleStore.ts
│   ├── types/             # TypeScript definitions
│   ├── constants/         # Static data
│   │   ├── sessions.ts    # Trading sessions
│   │   ├── defaultAlerts.ts
│   │   └── defaultRules.ts
│   └── navigation/        # Tab navigator
└── docs/                  # Documentation
```

## Data Flow
1. User opens app → Stores load data from SQLite
2. User creates/edits → Store updates → Persists to SQLite
3. UI re-renders via Zustand subscription

## Key Patterns
- **Stores as single source of truth:** All data flows through Zustand stores
- **Lazy database initialization:** DB opens on first access
- **Default seeding:** Alerts and rules auto-seed on first launch
- **Session auto-detection:** Current session determined by time
