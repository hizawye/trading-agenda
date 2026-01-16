# Trading Agenda - Changelog

## [0.2.0] - 2026-01-16

### Added
- Design system with centralized tokens (colors, typography, spacing, radii)
- 10 reusable UI components: FormModal, OptionPicker, Card, Stat, FormField, FAB, TradeCard, StatRow, SessionBadge, ScreenLayout
- EAS Build configuration (eas.json)

### Changed
- Minimalist UI redesign across all 6 screens
- Refactored screens to use shared components (47% reduction in JournalScreen alone)
- Unified modal pattern (FormModal) eliminates 400+ lines of duplication
- Consistent typography scale (4 levels: hero, title, body, caption)
- Settings store now loads on app init (App.tsx)

### Fixed
- Asset icons converted from misnamed JPEGs to proper PNG format
- All expo-doctor checks now pass (17/17)

## [0.1.1] - 2026-01-15

### Fixed
- Fixed crash in Expo Go by handling notification permission errors gracefully
- Fixed "Invalid Date" on Home screen by robustly handling NY time calculation

## [0.1.0] - 2026-01-14

### Added
- Initial project setup with Expo + TypeScript
- SQLite database with trades, alerts, and rules tables
- Zustand stores for state management
- Tab navigation with 5 screens:
  - Home: Dashboard with session indicator and stats
  - Journal: Trade list and add/edit functionality
  - Analytics: Win rate, session/setup breakdown, streaks
  - Alerts: Time-based trading alerts with toggle
  - Rules: Trading rules organized by category
- Pre-seeded alerts from ICT trading time windows
- Pre-seeded rules from trading notes
- Dark mode UI throughout
- Notification system foundation
