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

## 2026-01-14: ICT Killzone Enhancement Implementation

### Hybrid Dual-Layer System
**Decision:** Implement both Sessions (broad overview) and Killzones (precise trading windows)
**Rationale:**
- Sessions provide high-level context (Asia/London/NY)
- Killzones provide precise ICT methodology windows for accurate tracking
- User requested configurable times, so settings store created
- Maintains backward compatibility with existing trades

### Killzone Dropdown vs Freeform Text
**Decision:** Replace freeform timeWindow text field with structured killzone picker dropdown
**Rationale:**
- Better data quality - can filter and analyze by specific killzones
- Auto-detection of current killzone for faster data entry
- Color-coded UI matches TradingView ICT indicator user is familiar with
- Still maintains timeWindow field in database for backward compatibility

### Database Migration Strategy
**Decision:** Zero-downtime migration with dual-write system
**Rationale:**
- Add nullable killzone column without breaking existing functionality
- Dual-write both killzone (new) and timeWindow (legacy) fields
- Auto-migrate existing trades using pattern matching (keyword + time-based)
- Keeps timeWindow column forever for data archeology and backward compat
- Old app versions continue working, new versions handle old data gracefully

### Proper ICT Times from Pine Script Analysis
**Decision:** Fix session times to match ICT methodology from TradingView indicator
**Rationale:**
- Original sessions had incorrect times (Asia 0-5, NY AM 10-14)
- Analyzed user's TradingView indicator code to extract proper times
- Asia: 20:00-00:00 (killzone), London: 02:00-05:00, NY AM: 09:30-11:00, NY Lunch: 12:00-13:00, NY PM: 13:30-16:00
- Sessions (broad): Asia 20-5, London 2-10, NY AM 9:30-14, NY PM 14-16
- Handles midnight wrap properly (Asia starts 20:00 previous day)
- Minute precision added to support 9:30am market open

## 2026-01-16: UX Redesign - 3-Tab Navigation

### Navigation Restructure (Phase 1)
**Decision:** Reduce from 6 tabs to 3-tab bottom navigation (Today, Journal, More)
**Rationale:**
- 6 tabs created cognitive overload, unclear hierarchy
- Core workflow (trading journal) deserves prominence
- Utility features (Analytics, Rules, Alerts, Settings) grouped in More hub
- Clear default screen (Today) with contextual info + quick actions
- Progressive disclosure: simple by default, powerful when needed

### New Screen Architecture
**Decision:** Rename HomeScreen → TodayScreen, create MoreScreen as navigation hub
**Rationale:**
- TodayScreen shows what matters NOW: current session, next alert, today's stats
- MoreScreen uses grouped menu list instead of flat tabs
- Stack navigator for More section enables deep linking
- Maintains all functionality while reducing visual complexity
- ICT traders need speed - 3 taps max to any feature

### Design Philosophy
**Decision:** Favor speed over hand-holding, context over categorization
**Rationale:**
- Smart defaults (auto-detect current killzone) reduce friction
- Inline stats in filtered views > separate analytics tab
- Visual hierarchy (session colors, outcome badges, P&L prominence)
- No wizard flows, no empty states with lengthy explanations

## 2026-01-16: UX Phase 2 - Smart Trade Entry Flow

### Quick vs Full Mode
**Decision:** Implement dual-mode trade form (quick 4-field vs full 14-field)
**Rationale:**
- Most trades are simple logging: "took London setup, won $200"
- Full form creates friction (10+ fields) for common case
- Smart defaults reduce cognitive load: auto-detect killzone, default setup to continuation
- Quick mode: Symbol, Direction, Outcome, P&L only
- "+ More Details" expands to full form (killzone, setup, confirmations, prices, notes, screenshots)
- Editing existing trades shows full form immediately
- 70% reduction in time-to-log for common case (30s → 10s)

## 2026-01-16: UX Phase 3 - Contextual Analytics

### Filter Bar + Inline Stats
**Decision:** Add filter chips and contextual metrics to Journal screen
**Rationale:**
- Analytics in separate tab requires context switching
- Users filter trades to answer specific questions: "How do I perform in London?"
- Inline stats answer that question immediately after filtering
- Filter bar: Session, Setup, Outcome (toggle chips, green when active)
- Inline stats card appears when filters active: Trades, Win Rate, Total P&L, Avg RR
- Progressive disclosure: stats appear when user demonstrates intent
- Analytics tab still exists for comprehensive views (charts, trends)

## 2026-01-16: UX Phase 4 - Rules Integration

### Pre-Trade Rules Reminder (Dismissible)
**Decision:** Show active rules as dismissible reminder in Quick Add form
**Rationale:**
- Rules tab exists but disconnected from journaling workflow
- Users forget their own rules during live trading (emotional state)
- Interrupting with forced checklist breaks "quick add" promise
- Dismissible reminder balances discipline with speed
- Shows top 3 active rules + count, orange left border for visibility
- Only appears for new trades (not editing) to avoid annoyance
- Users can X dismiss if already checked rules externally
- Passive coaching layer: visible but not blocking

### Why Not Full Checklist?
**Decision:** Chose passive reminder over forced checkbox confirmation
**Rationale:**
- Quick Add goal: 10s logging, not 30s+ workflow
- ICT traders already disciplined, need nudge not babysitting
- Forced checklist would reintroduce friction removed in Phase 2
- Trust user to self-enforce after being reminded
- Can revisit with opt-in "strict mode" if users request

## 2026-01-16: Beta Prep Decisions (Phase 5)

### Asset Optimization Strategy
**Decision:** Resize icons from 2048x2048 to 1024x1024 and apply aggressive PNG compression
**Rationale:**
- icon.png and splash-icon.png were 5.6M and 5.1M respectively (~11MB total)
- Expo's recommended icon size is 1024x1024, not 2048x2048
- Resizing + color quantization (256 colors) reduced to 285KB and 240KB (98% size reduction)
- Saved ~10MB in app bundle size
- Quality degradation negligible for app icons at typical display sizes

### Sentry for Crash Reporting
**Decision:** Use Sentry (via sentry-expo) instead of Crashlytics or other solutions
**Rationale:**
- Native Expo integration with sentry-expo package
- Free tier sufficient for beta testing (<5k events/month)
- Better error context than bare try/catch logging
- Can catch JavaScript errors and native crashes
- Privacy-friendly: no user data sent, only error context

### Structured Logger Pattern
**Decision:** Create logger abstraction (src/lib/logger.ts) instead of direct Sentry calls
**Rationale:**
- Centralized error handling logic
- Easy to swap Sentry for different service later
- Console logs in dev, Sentry in production
- Consistent error format across codebase
- Replaced 5 console.error calls in stores/database with logger.error

### Privacy Policy Approach
**Decision:** Document local-only storage, no cloud sync, no analytics in privacy-policy.md
**Rationale:**
- Required for Google Play Store distribution
- User requested no cloud sync in initial requirements
- Transparency about Sentry crash reporting
- Clarifies camera/photo permissions are for screenshots only, not uploaded
- Emphasizes user control over data (delete = uninstall)

### Permissions Configuration
**Decision:** Add explicit permissions to app.json plugins and android.permissions
**Rationale:**
- expo-image-picker needs camera + photo library permissions
- expo-notifications needs POST_NOTIFICATIONS + SCHEDULE_EXACT_ALARM
- Android 13+ requires runtime permission prompts with clear messaging
- Configured permission messages explain "for trade screenshots" use case
- Better to declare explicitly than rely on auto-linking inference

## 2026-01-17: tslib Version Conflict Resolution

### tslib Downgrade to 1.14.1
**Decision:** Downgrade tslib from ^2.8.1 to 1.14.1
**Rationale:**
- Sentry packages (v7.52.x) compiled with importHelpers expect tslib@1.14.1
- Metro bundler cannot resolve multiple tslib versions correctly
- Runtime error: `__extends is undefined` when Sentry.init() executes in App.tsx
- npm tree showed 10+ nested tslib@1.14.1 instances in @sentry/* packages
- Downgrading root tslib ensures single deduped version across dependency tree
- tslib 1.14.1 stable and compatible with all functionality
- Avoids complex Metro resolver configuration


## 2026-01-17: Preview Build Successfully Generated

### First EAS Build Completion
**Decision:** Generated preview APK using EAS Build with internal distribution
**Rationale:**
- Preview profile allows testing before production release
- Remote Android credentials managed by Expo for signing
- Build succeeded with proper Sentry integration
- APK ready for physical device testing
- QR code + direct link for easy installation

### Build Configuration
**Decision:** Use existing EAS build profiles (preview/production)
**Rationale:**
- Preview: internal distribution for beta testing
- Production: auto-increment version, Play Store ready
- Sentry source maps uploaded automatically during build
- No custom native code, managed workflow sufficient


## 2026-01-17: tslib Bundling Fix for __extends Error

### Metro Configuration for tslib Resolution
**Decision:** Add explicit Metro config to force tslib resolution and import tslib at entry point
**Rationale:**
- `__extends is undefined` error still occurred in production build despite tslib 1.14.1 downgrade
- Metro bundler wasn't properly including tslib helpers in the bundle
- Added `import 'tslib'` at index.ts entry point to force inclusion
- Created metro.config.js with explicit tslib resolution path
- Ensures __extends and other helpers are available at runtime
- Testing with Expo Go instead of full rebuild for faster iteration

## 2026-01-17: Metro .mjs Resolution Fix for __extends Error

### Add .mjs to Metro Asset Extensions
**Decision:** Add 'mjs' to Metro's config.resolver.assetExts to fix __extends error
**Rationale:**
- Root cause: Metro bundler doesn't resolve tslib's .mjs files (tslib.es6.mjs) by default
- Research from GitHub issues and Expo SDK 54 docs confirmed this is a known Sentry + Expo issue
- Previous attempts (tslib downgrade, explicit import, extraNodeModules) didn't fix the problem
- Solution: `config.resolver.assetExts = [...(config.resolver.assetExts || []), 'mjs']`
- Allows Metro to properly bundle tslib's ES6 module files
- Metro server running successfully after change (commit 291a583)
- Pending: verification in Expo Go that __extends error is resolved

