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
│   │   └── ICTReferenceScreen.tsx # ICT concepts, setups, time reference
│   ├── components/        # Reusable UI components
│   │   ├── Card.tsx       # Minimal card wrapper
│   │   ├── CurrentPhaseCard.tsx # AMD phase + macro + micro quarter display
│   │   ├── FAB.tsx        # Floating action button
│   │   ├── FilterStats.tsx # Stats card for filtered results
│   │   ├── FormField.tsx  # Labeled text input
│   │   ├── FormModal.tsx  # Generic modal with save/cancel/delete
│   │   ├── OptionPicker.tsx # Multi-option selector
│   │   ├── RulesReminder.tsx # Pre-trade rules reminder
│   │   ├── ScreenLayout.tsx # Screen wrapper with padding
│   │   ├── SessionBadge.tsx # Color-coded session badge
│   │   ├── SessionTimeline.tsx # Time macros timeline display
│   │   ├── Stat.tsx       # Value + label display
│   │   ├── StatRow.tsx    # Horizontal stats row
│   │   ├── TemplateSelector.tsx # Weekly template picker with categories
│   │   ├── TradeCard.tsx  # Trade list item
│   │   ├── TradeDashboard.tsx # Session/time/stats dashboard
│   │   ├── TradeFilters.tsx # Filter chips component
│   │   ├── TradeForm.tsx  # Quick/Full trade entry form
│   │   └── WeeklyOverview.tsx # Weekly template day grid
│   ├── hooks/             # Custom React hooks
│   │   └── useTradeForm.ts # Trade form state management
│   ├── design/            # Design system
│   │   ├── tokens.ts      # Colors, typography, spacing, radii
│   │   └── utils.ts       # Color helper functions
│   ├── lib/               # Core utilities
│   │   ├── database.ts    # SQLite operations
│   │   ├── notifications.ts # Push notification setup
│   │   ├── utils.ts       # Helper functions
│   │   ├── ictProfiles.ts # Re-exports from ict/ for backward compat
│   │   └── ict/           # ICT Module (NEW)
│   │       ├── index.ts   # Barrel export
│   │       ├── types.ts   # All ICT types
│   │       ├── timeMacros.ts # 8 time macros + helpers
│   │       ├── quarters.ts # Session quarters + micro cycles
│   │       ├── weeklyProfiles.ts # 14 weekly templates
│   │       ├── sessionStrategies.ts # 4 session strategies
│   │       ├── threeDayCycle.ts # Taylor 3-Day Cycle
│   │       ├── basics.ts  # ICT reference (concepts, setups, PD arrays)
│   │       ├── amd.ts     # AMD phase definitions
│   │       ├── marketState.ts # Aggregated state
│   │       └── intradayProfiles.ts # Intraday profile types
│   ├── stores/            # Zustand state stores
│   │   ├── tradeStore.ts
│   │   ├── alertStore.ts
│   │   ├── ruleStore.ts
│   │   ├── settingsStore.ts
│   │   └── ictStore.ts    # ICT state (templates, macros, quarters)
│   ├── types/             # TypeScript definitions
│   │   └── ict.ts         # Re-exports from lib/ict/types
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
- **Versioned migrations:** Sequential schema changes tracked via PRAGMA user_version
- **Atomic transactions:** Each migration wrapped in BEGIN/COMMIT/ROLLBACK for safety
- **Default seeding:** Alerts and rules auto-seed on first launch
- **Session auto-detection:** Current session determined by time
- **Design system:** Centralized tokens for consistent styling across screens
- **Component composition:** Screens built from reusable primitives (Card, Stat, FormModal, etc.)

## Database Migration System
- **Version tracking:** Uses SQLite's PRAGMA user_version (0 = fresh install)
- **Migration registry:** Array of numbered migrations in database.ts
- **Bootstrap vs upgrade:** New installs create schema then set version, existing DBs run pending migrations only
- **Idempotent migrations:** Check for existing columns/indexes before adding
- **Rollback on failure:** Transaction rollback prevents partial migrations
- **Debug utilities:** getSchemaVersion() and resetDatabase() for development
