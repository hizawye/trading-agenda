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
