import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { colors, typography, spacing, radii } from '../design/tokens';
import { outcomeColor, directionColor } from '../design/utils';
import { SessionBadge } from './SessionBadge';
import type { Trade, SessionInfo, KillzoneInfo } from '../types';

interface TradeCardProps {
  trade: Trade;
  session?: SessionInfo;
  killzone?: KillzoneInfo;
  onPress: () => void;
}

export function TradeCard({ trade, session, killzone, onPress }: TradeCardProps) {
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.header}>
        <View style={styles.badges}>
          {session && <SessionBadge name={session.name} color={session.color} size="sm" />}
          {killzone && <SessionBadge name={killzone.name} color={killzone.color} size="sm" />}
        </View>
        <Text style={[styles.direction, { color: directionColor(trade.direction) }]}>
          {trade.direction.toUpperCase()}
        </Text>
      </View>

      <View style={styles.body}>
        <View style={styles.mainInfo}>
          <Text style={styles.symbol}>{trade.symbol || '—'}</Text>
          <Text style={styles.setup}>{trade.setupType.replace('_', ' ')}</Text>
          <Text style={styles.time}>
            {formatDate(trade.timestamp)} · {formatTime(trade.timestamp)}
          </Text>
        </View>

        <View style={styles.result}>
          <View style={[styles.outcomeBadge, { backgroundColor: outcomeColor(trade.outcome) }]}>
            <Text style={styles.outcomeText}>{trade.outcome.toUpperCase()}</Text>
          </View>
          {trade.pnl !== undefined && (
            <Text style={[styles.pnl, { color: outcomeColor(trade.outcome) }]}>
              {trade.pnl >= 0 ? '+' : ''}{trade.pnl.toFixed(2)}
            </Text>
          )}
        </View>
      </View>

      {trade.confirmations.length > 0 && (
        <View style={styles.confirmations}>
          {trade.confirmations.slice(0, 4).map((c) => (
            <View key={c} style={styles.confirmBadge}>
              <Text style={styles.confirmText}>{c.toUpperCase()}</Text>
            </View>
          ))}
          {trade.confirmations.length > 4 && (
            <Text style={styles.moreConfirms}>+{trade.confirmations.length - 4}</Text>
          )}
        </View>
      )}

      {trade.images.length > 0 && (
        <View style={styles.images}>
          {trade.images.slice(0, 3).map((uri, i) => (
            <Image key={i} source={{ uri }} style={styles.thumbnail} />
          ))}
          {trade.images.length > 3 && (
            <View style={styles.moreImages}>
              <Text style={styles.moreImagesText}>+{trade.images.length - 3}</Text>
            </View>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.bg.secondary,
    borderRadius: radii.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  badges: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  direction: {
    fontSize: 12,
    fontWeight: '700',
  },
  body: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  mainInfo: {
    flex: 1,
  },
  symbol: {
    ...typography.title,
    fontSize: 20,
  },
  setup: {
    ...typography.caption,
    textTransform: 'capitalize',
    marginTop: 2,
  },
  time: {
    ...typography.caption,
    color: colors.text.tertiary,
    marginTop: 2,
  },
  result: {
    alignItems: 'flex-end',
  },
  outcomeBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radii.sm,
  },
  outcomeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '700',
  },
  pnl: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: spacing.xs,
  },
  confirmations: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
  confirmBadge: {
    backgroundColor: colors.bg.tertiary,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radii.sm,
  },
  confirmText: {
    color: colors.text.secondary,
    fontSize: 10,
    fontWeight: '500',
  },
  moreConfirms: {
    ...typography.caption,
    color: colors.text.tertiary,
  },
  images: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
  thumbnail: {
    width: 48,
    height: 48,
    borderRadius: radii.sm,
    backgroundColor: colors.bg.tertiary,
  },
  moreImages: {
    width: 48,
    height: 48,
    borderRadius: radii.sm,
    backgroundColor: colors.bg.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moreImagesText: {
    ...typography.caption,
    color: colors.text.tertiary,
  },
});
