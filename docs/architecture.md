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
├── App.tsx                 # Entry point (loads settings on init)
├── src/
│   ├── screens/           # Tab screens (refactored to use shared components)
│   ├── components/        # Reusable UI components
│   │   ├── Card.tsx       # Minimal card wrapper
│   │   ├── FAB.tsx        # Floating action button
│   │   ├── FormField.tsx  # Labeled text input
│   │   ├── FormModal.tsx  # Generic modal with save/cancel/delete
│   │   ├── OptionPicker.tsx # Multi-option selector
│   │   ├── ScreenLayout.tsx # Screen wrapper with padding
│   │   ├── SessionBadge.tsx # Color-coded session badge
│   │   ├── Stat.tsx       # Value + label display
│   │   ├── StatRow.tsx    # Horizontal stats row
│   │   └── TradeCard.tsx  # Trade list item
│   ├── design/            # Design system
│   │   ├── tokens.ts      # Colors, typography, spacing, radii
│   │   └── utils.ts       # Color helper functions
│   ├── lib/               # Core utilities
│   │   ├── database.ts    # SQLite operations
│   │   ├── notifications.ts # Push notification setup
│   │   └── utils.ts       # Helper functions
│   ├── stores/            # Zustand state stores
│   │   ├── tradeStore.ts
│   │   ├── alertStore.ts
│   │   ├── ruleStore.ts
│   │   └── settingsStore.ts
│   ├── types/             # TypeScript definitions
│   ├── constants/         # Static data
│   │   ├── sessions.ts    # Trading sessions
│   │   ├── killzones.ts   # Killzone definitions
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
- **Design system:** Centralized tokens for consistent styling across screens
- **Component composition:** Screens built from reusable primitives (Card, Stat, FormModal, etc.)
