import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { TradeFormValues, TradeFormHandlers } from '../hooks/useTradeForm';
import { SetupType, TradeDirection, TradeOutcome, Confirmation, Killzone } from '../types';
import { DEFAULT_KILLZONES } from '../constants/killzones';
import { FormField, FormLabel } from './FormField';
import { OptionPicker } from './OptionPicker';
import { colors, typography, spacing, radii } from '../design/tokens';
import { outcomeColor } from '../design/utils';

const SETUP_TYPES: SetupType[] = ['continuation', 'reversal', 'liquidity_sweep', 'fvg_fill', 'breakout', 'other'];
const CONFIRMATIONS: Confirmation[] = ['smt', 'mss', 'bos', 'fvg', 'swing_sweep', 'pd_array', 'time_window'];
const OUTCOMES: TradeOutcome[] = ['win', 'loss', 'breakeven', 'pending'];

interface Props {
  values: TradeFormValues;
  handlers: TradeFormHandlers;
  isEditing: boolean;
}

export function TradeForm({ values, handlers, isEditing }: Props) {
  const { quickMode } = values;

  if (quickMode && !isEditing) {
    return (
      <>
        <FormField label="Symbol" value={values.symbol} onChangeText={handlers.setSymbol} placeholder="ES, NQ, BTC..." />

        <FormLabel>Direction</FormLabel>
        <OptionPicker
          options={[
            { value: 'long' as TradeDirection, label: 'LONG', color: colors.semantic.success },
            { value: 'short' as TradeDirection, label: 'SHORT', color: colors.semantic.error },
          ]}
          selected={values.direction}
          onSelect={handlers.setDirection}
        />

        <FormLabel>Outcome</FormLabel>
        <OptionPicker
          options={OUTCOMES.map((o) => ({ value: o, label: o.toUpperCase(), color: outcomeColor(o) }))}
          selected={values.outcome}
          onSelect={handlers.setOutcome}
        />

        <FormField label="P&L" value={values.pnl} onChangeText={handlers.setPnl} keyboardType="decimal-pad" placeholder="0.00" />

        <TouchableOpacity style={styles.moreDetailsBtn} onPress={() => handlers.setQuickMode(false)}>
          <Text style={styles.moreDetailsText}>+ More Details</Text>
        </TouchableOpacity>
      </>
    );
  }

  return (
    <>
      {!isEditing && (
        <TouchableOpacity style={styles.quickModeBtn} onPress={() => handlers.setQuickMode(true)}>
          <Text style={styles.quickModeText}>← Quick Add</Text>
        </TouchableOpacity>
      )}

      <FormLabel>Killzone</FormLabel>
      <OptionPicker
        options={DEFAULT_KILLZONES.map((kz) => ({ value: kz.id, label: kz.name, color: kz.color }))}
        selected={values.killzone}
        onSelect={(kz: Killzone) => {
          handlers.setKillzone(kz);
          const kzInfo = DEFAULT_KILLZONES.find((k) => k.id === kz);
          if (kzInfo) handlers.setSession(kzInfo.session);
        }}
      />

      <FormLabel>Direction</FormLabel>
      <OptionPicker
        options={[
          { value: 'long' as TradeDirection, label: 'LONG', color: colors.semantic.success },
          { value: 'short' as TradeDirection, label: 'SHORT', color: colors.semantic.error },
        ]}
        selected={values.direction}
        onSelect={handlers.setDirection}
      />

      <FormLabel>Setup Type</FormLabel>
      <OptionPicker
        options={SETUP_TYPES.map((s) => ({ value: s, label: s.replace('_', ' ') }))}
        selected={values.setupType}
        onSelect={handlers.setSetupType}
      />

      <FormLabel>Confirmations</FormLabel>
      <OptionPicker
        options={CONFIRMATIONS.map((c) => ({ value: c, label: c.toUpperCase() }))}
        selected={values.confirmations}
        onSelect={handlers.toggleConfirmation}
        multiple
      />

      <FormField label="Symbol" value={values.symbol} onChangeText={handlers.setSymbol} placeholder="ES, NQ, BTC..." />

      <View style={styles.priceRow}>
        <View style={styles.priceField}>
          <FormField label="Entry" value={values.entry} onChangeText={handlers.setEntry} keyboardType="decimal-pad" placeholder="0.00" />
        </View>
        <View style={styles.priceField}>
          <FormField label="Stop Loss" value={values.stopLoss} onChangeText={handlers.setStopLoss} keyboardType="decimal-pad" placeholder="0.00" />
        </View>
        <View style={styles.priceField}>
          <FormField label="Take Profit" value={values.takeProfit} onChangeText={handlers.setTakeProfit} keyboardType="decimal-pad" placeholder="0.00" />
        </View>
      </View>

      <FormLabel>Outcome</FormLabel>
      <OptionPicker
        options={OUTCOMES.map((o) => ({ value: o, label: o.toUpperCase(), color: outcomeColor(o) }))}
        selected={values.outcome}
        onSelect={handlers.setOutcome}
      />

      <FormField label="P&L (optional)" value={values.pnl} onChangeText={handlers.setPnl} keyboardType="decimal-pad" placeholder="0.00" />

      <FormField label="Notes" value={values.notes} onChangeText={handlers.setNotes} placeholder="Trade notes..." multiline />

      <FormLabel>Screenshots</FormLabel>
      <View style={styles.imagesContainer}>
        {values.images.map((uri, index) => (
          <TouchableOpacity key={index} onPress={() => handlers.removeImage(uri)} style={styles.imageWrapper}>
            <Image source={{ uri }} style={styles.thumbnail} />
            <View style={styles.removeImageBadge}>
              <Text style={styles.removeImageText}>×</Text>
            </View>
          </TouchableOpacity>
        ))}
        <TouchableOpacity style={styles.addImageBtn} onPress={handlers.pickImage}>
          <Text style={styles.addImageText}>+</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  priceRow: { flexDirection: 'row', gap: spacing.sm },
  priceField: { flex: 1 },
  imagesContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  imageWrapper: { position: 'relative' },
  thumbnail: { width: 80, height: 80, borderRadius: radii.sm, backgroundColor: colors.bg.tertiary },
  removeImageBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.semantic.error,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeImageText: { color: '#FFF', fontSize: 16, fontWeight: 'bold', marginTop: -2 },
  addImageBtn: {
    width: 80,
    height: 80,
    borderRadius: radii.sm,
    backgroundColor: colors.bg.tertiary,
    borderWidth: 2,
    borderColor: colors.text.tertiary,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addImageText: { color: colors.text.secondary, fontSize: 28 },
  moreDetailsBtn: {
    marginTop: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.bg.tertiary,
    borderRadius: radii.md,
    alignItems: 'center',
  },
  moreDetailsText: {
    ...typography.body,
    color: colors.semantic.success,
    fontWeight: '600',
  },
  quickModeBtn: {
    marginBottom: spacing.sm,
    padding: spacing.sm,
    alignItems: 'flex-start',
  },
  quickModeText: {
    ...typography.caption,
    color: colors.semantic.success,
    fontWeight: '600',
  },
});
