# Trading Agenda - Decision Log

## 2026-01-14: Initial Architecture Decisions

### React Native + Expo
**Decision:** Use Expo managed workflow instead of bare React Native
**Rationale:** Faster development, easier notifications, OTA updates, no native build config needed

### SQLite for Storage
**Decision:** Use expo-sqlite instead of AsyncStorage or external database
**Rationale:**
- Structured data (trades, alerts, rules) benefits from SQL
- Better query performance for analytics
- No cloud sync needed (per user request)

### Zustand for State
**Decision:** Use Zustand instead of Redux or Context
**Rationale:**
- Minimal boilerplate
- Works well with async SQLite operations
- Easy to create multiple focused stores

### Dark Mode Primary
**Decision:** Default to dark mode UI
**Rationale:** User trades early morning sessions (2am-7am), dark mode easier on eyes

### Pre-seeded Data
**Decision:** Seed default alerts and rules from user's trading notes
**Rationale:** App is immediately useful with user's specific time windows and rules

### Local-Only Storage
**Decision:** No cloud backend, all data stays on device
**Rationale:** User explicitly requested local-only to keep it simple

## 2026-01-14: Package Version Compatibility Fix

### React Native Package Downgrades
**Decision:** Downgrade react-native-gesture-handler (2.30.0 → 2.28.0) and react-native-screens (4.19.0 → 4.16.0)
**Rationale:** Expo 54 SDK expects specific peer dependency versions. Using incompatible versions causes runtime issues and build warnings.

### SQLite Boolean Type Casting
**Decision:** Explicitly cast boolean fields to integers in SELECT queries
**Rationale:** Android SQLite returns booleans as 1/0 strings, not numbers. The `(enabled + 0)` pattern forces numeric conversion for consistency across platforms.

## 2026-01-14: NY Timezone Implementation

### America/New_York Timezone for All Sessions
**Decision:** Use NY timezone (America/New_York) for all session indicators, alerts, and countdowns instead of user's local timezone
**Rationale:**
- ICT trading methodology is based on New York market hours
- All session times (Asia 12am-5am, London 5am-10am, NY AM 10am-2pm, NY PM 2pm-8pm) are in EST/EDT
- Using local timezone would show incorrect session indicators for users outside EST
- Ensures consistent trading times regardless of user location
