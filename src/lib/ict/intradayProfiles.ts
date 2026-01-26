import { IntradayProfile, ProfileType } from './types';

export const INTRADAY_PROFILES: Record<ProfileType, IntradayProfile> = {
  normal_buy: {
    type: 'normal_buy',
    name: 'Classic Bullish Day',
    description: 'Low forms in London/early NY, rallies into PM session',
    entryWindow: 'London Open or NY AM Open',
    characteristics: [
      'Asian range is small/contained',
      'London sweeps Asian low',
      'NY AM confirms bullish structure',
      'PM session makes high of day',
    ],
  },
  delayed_buy: {
    type: 'delayed_buy',
    name: 'Seek & Destroy Bullish',
    description: 'Extended manipulation, late entry after false breakdown',
    entryWindow: 'After 10:00 AM NY',
    characteristics: [
      'London makes false high first',
      'NY AM sweeps London low',
      'Entry after manipulation complete',
      'Compressed move into close',
    ],
  },
  normal_sell: {
    type: 'normal_sell',
    name: 'Classic Bearish Day',
    description: 'High forms in London/early NY, sells off into PM session',
    entryWindow: 'London Open or NY AM Open',
    characteristics: [
      'Asian range is small/contained',
      'London sweeps Asian high',
      'NY AM confirms bearish structure',
      'PM session makes low of day',
    ],
  },
  delayed_sell: {
    type: 'delayed_sell',
    name: 'Seek & Destroy Bearish',
    description: 'Extended manipulation, late entry after false breakout',
    entryWindow: 'After 10:00 AM NY',
    characteristics: [
      'London makes false low first',
      'NY AM sweeps London high',
      'Entry after manipulation complete',
      'Compressed move into close',
    ],
  },
};
