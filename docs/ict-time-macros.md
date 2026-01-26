# ICT Time Macros

Source: Michael J. Huddleston via time-price-research-astrofin.blogspot.com

## What Are Time Macros?

**Timed directives for market maker algorithms to seek and take out liquidity levels and imbalances.**

- Duration: typically **20-30 minutes**
- Increase market volatility
- Signal high-probability trading setups
- Common pattern: last 10 min of closing hour + first 10 min of opening hour
- Also: every 15 minutes in the final hour

---

## 8 Primary ICT Time Macros (EST/EDT)

| Macro | Time | Notes |
|-------|------|-------|
| London Pre-Open | 02:33 - 03:00 | |
| London Open | 04:03 - 04:30 | |
| NY AM | 08:50 - 09:10 | |
| London Close | 09:50 - 10:10 | Algorithm starts running for liquidity |
| London Fix | 10:50 - 11:10 | End of 3rd hour NY AM, first 90 min floor trading |
| NY AM Close | 11:50 - 12:10 | |
| NY Lunch | 13:10 - 13:40 | |
| NY PM Close | 15:15 - 15:45 | |

**Note:** There are NO ICT macros during the Asian Session.

---

## Macro Types by Market Action

### Manipulation Macros
- Sweep **both** buy-side and sell-side liquidity
- Expect choppy price action

### Expansion Macros
- Sweep liquidity on **only one side**
- Trending price action

### Accumulation Macros
- Ranging prices
- Building positions
