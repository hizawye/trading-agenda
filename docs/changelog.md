# Trading Agenda - Changelog

## [0.3.2] - 2026-01-23

### Fixed
- Database connection bug: added `useNewConnection: true` to prevent NullPointerException on repeated SQLite operations
- Notification timezone: alerts now convert NY time to device local time for correct firing
- Alert store error handling: add/update operations now properly catch and propagate errors

### Changed
- CalendarGrid: fixed variable shadowing for pnlColor
- Notifications: weekday calculation now accounts for timezone day boundary crossings

### Added
- `convertNYTimeToLocal()` utility for timezone-aware notification scheduling

## [0.3.0] - 2026-01-16 (Beta Prep)

### Added
- Sentry crash reporting integration for production monitoring
- Structured logger (src/lib/logger.ts) with Sentry integration
- Privacy policy documenting local-only data storage
- Explicit permissions configuration for camera, photo library, and notifications
- Permission messages explaining screenshot use case

### Changed
- Optimized assets: icon.png (5.6M → 285KB) and splash-icon.png (5.1M → 240KB) - saved ~10MB
- Replaced all console.error calls with structured logger in stores and database
- App bundle size reduced by ~10MB

### Fixed
- Type check now passing (npx tsc --noEmit)

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

## [0.3.1] - 2026-01-17 (First Build)

### Added
- Preview APK build generated via EAS Build
- QR code installation method for easy device deployment

### Changed
- Ready for physical device testing phase
- App display name updated from "trading-agenda" to "Trading agenda"

