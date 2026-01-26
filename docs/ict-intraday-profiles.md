# ICT Intraday Profiles

## Prerequisites

Before applying intraday profiles, check:
- **CBDR** (Central Bank Dealers Range): 2PM-8PM EST → Must be < 40 pips
- **Asian Range**: 8PM-12AM EST → Must be < 20-30 pips

If ranges are too large, profiles are less reliable.

---

## Profile Types

### 1. Normal Protraction Sell Profile
**Bias**: Bearish

| Time (EST) | Action |
|------------|--------|
| 00:00-02:00 | Price rallies UP (Judas Swing) |
| 02:00+ | Reversal, expansion DOWN |

**Entry**:
1. Wait for rally above CBDR high
2. Look for MSS (Market Structure Shift) on 5min
3. Short at premium PD arrays
4. Stop above London session high

---

### 2. Delayed Protraction Sell Profile
**Bias**: Bearish (delayed manipulation)

| Time (EST) | Action |
|------------|--------|
| 00:00-02:00 | No significant rally |
| 02:00+ | Delayed rally, THEN reversal DOWN |

**Entry**:
1. No early Judas swing
2. Wait for rally AFTER 02:00
3. Short at premium PD arrays after MSS

---

### 3. Normal Protraction Buy Profile
**Bias**: Bullish

| Time (EST) | Action |
|------------|--------|
| 00:00-02:00 | Price dips DOWN (Judas Swing) |
| 02:00+ | Reversal, expansion UP |

**Entry**:
1. Wait for dip below CBDR low
2. Look for MSS on 5min
3. Long at discount PD arrays
4. Stop below London session low

---

### 4. Delayed Protraction Buy Profile
**Bias**: Bullish (delayed manipulation)

| Time (EST) | Action |
|------------|--------|
| 00:00-02:00 | No significant dip |
| 02:00+ | Delayed dip, THEN reversal UP |

**Entry**:
1. No early Judas swing
2. Wait for dip AFTER 02:00
3. Long at discount PD arrays after MSS

---

## Profile Selection Flowchart

```
1. Determine Daily Bias (HTF analysis)
   ├── Bullish → Look for BUY profiles
   └── Bearish → Look for SELL profiles

2. Check CBDR & Asian Range sizes
   ├── CBDR < 40 pips, Asian < 30 pips → Profiles valid
   └── Ranges too large → Skip profiles, trade HTF levels

3. Monitor 00:00-02:00 price action
   ├── Judas swing occurs → NORMAL protraction
   └── No Judas swing → DELAYED protraction (wait for 02:00+)

4. Wait for MSS confirmation on LTF (5min)

5. Enter at PD Array (Premium for sells, Discount for longs)
```

---

## Best Profile
**London Normal Protraction** is the highest probability setup because:
- Clear Judas swing provides stop hunt
- MSS confirmation before entry
- Maximum time for distribution move

---

## Seek & Destroy Days (Friday)
When high-impact news is pending:
- Price whipsaws both directions
- Both buy-side AND sell-side liquidity gets swept
- Avoid trading or use very tight targets

---

## Sources
- [ICT Intraday Profiles](https://innercircletrader.net/tutorials/ict-intraday-profiles/)
