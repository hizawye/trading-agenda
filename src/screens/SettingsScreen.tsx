import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Alert } from 'react-native';
import { useSettingsStore } from '../stores/settingsStore';
import { TimeRange, Session, Killzone } from '../types';
import { colors, typography, spacing, radii } from '../design/tokens';
import { ScreenLayout } from '../components/ScreenLayout';
import { Card } from '../components/Card';

type TimePickerMode = 'session' | 'killzone';
type TimePickerField = 'start' | 'end';

interface TimePickerState {
  visible: boolean;
  mode: TimePickerMode;
  id: Session | Killzone | null;
  field: TimePickerField;
  hour: number;
  minute: number;
}

const formatTime = (hour: number, minute: number): string => {
  const h = hour % 12 || 12;
  const ampm = hour < 12 ? 'AM' : 'PM';
  return `${h}:${minute.toString().padStart(2, '0')} ${ampm}`;
};

export default function SettingsScreen() {
  const { loaded, loadSettings, updateSessionTimes, updateKillzoneTimes, resetToDefaults, getSessions, getKillzones } = useSettingsStore();
  const [timePicker, setTimePicker] = useState<TimePickerState>({
    visible: false,
    mode: 'session',
    id: null,
    field: 'start',
    hour: 0,
    minute: 0,
  });

  useEffect(() => {
    if (!loaded) {
      loadSettings();
    }
  }, [loaded]);

  const sessions = getSessions();
  const killzones = getKillzones();

  const openTimePicker = (mode: TimePickerMode, id: Session | Killzone, field: TimePickerField, times: TimeRange) => {
    const hour = field === 'start' ? times.startHour : times.endHour;
    const minute = field === 'start' ? times.startMinute : times.endMinute;
    setTimePicker({ visible: true, mode, id, field, hour, minute });
  };

  const handleTimeChange = (type: 'hour' | 'minute', delta: number) => {
    setTimePicker((prev) => {
      if (type === 'hour') {
        return { ...prev, hour: (prev.hour + delta + 24) % 24 };
      } else {
        return { ...prev, minute: (prev.minute + delta + 60) % 60 };
      }
    });
  };

  const saveTime = async () => {
    const { mode, id, field, hour, minute } = timePicker;
    if (!id) return;

    if (mode === 'session') {
      const session = sessions.find((s) => s.id === id);
      if (session) {
        const newTimes: TimeRange = {
          ...session.times,
          ...(field === 'start' ? { startHour: hour, startMinute: minute } : { endHour: hour, endMinute: minute }),
        };
        await updateSessionTimes(id as Session, newTimes);
      }
    } else {
      const killzone = killzones.find((k) => k.id === id);
      if (killzone) {
        const newTimes: TimeRange = {
          ...killzone.times,
          ...(field === 'start' ? { startHour: hour, startMinute: minute } : { endHour: hour, endMinute: minute }),
        };
        await updateKillzoneTimes(id as Killzone, newTimes);
      }
    }

    setTimePicker((prev) => ({ ...prev, visible: false }));
  };

  const handleReset = () => {
    Alert.alert(
      'Reset to Defaults',
      'This will reset all session and killzone times to their default values.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Reset', style: 'destructive', onPress: () => resetToDefaults() },
      ]
    );
  };

  if (!loaded) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading settings...</Text>
      </View>
    );
  }

  return (
    <ScreenLayout>
      {/* Sessions Section */}
      <Text style={styles.sectionTitle}>Session Times</Text>
      <Text style={styles.sectionSubtitle}>All times in NY timezone (EST/EDT)</Text>

      {sessions.map((session) => (
        <Card key={session.id}>
          <View style={styles.timeCardHeader}>
            <View style={[styles.colorDot, { backgroundColor: session.color }]} />
            <Text style={styles.timeName}>{session.name}</Text>
          </View>
          <View style={styles.timeRow}>
            <TouchableOpacity
              style={styles.timeButton}
              onPress={() => openTimePicker('session', session.id, 'start', session.times)}
            >
              <Text style={styles.timeLabel}>Start</Text>
              <Text style={styles.timeValue}>{formatTime(session.times.startHour, session.times.startMinute)}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.timeButton}
              onPress={() => openTimePicker('session', session.id, 'end', session.times)}
            >
              <Text style={styles.timeLabel}>End</Text>
              <Text style={styles.timeValue}>{formatTime(session.times.endHour, session.times.endMinute)}</Text>
            </TouchableOpacity>
          </View>
        </Card>
      ))}

      {/* Killzones Section */}
      <Text style={[styles.sectionTitle, { marginTop: spacing.xl }]}>Killzone Times</Text>
      <Text style={styles.sectionSubtitle}>Precise trading windows for entries</Text>

      {killzones.map((kz) => (
        <Card key={kz.id}>
          <View style={styles.timeCardHeader}>
            <View style={[styles.colorDot, { backgroundColor: kz.color }]} />
            <View>
              <Text style={styles.timeName}>{kz.name}</Text>
              <Text style={styles.timeDescription}>{kz.description}</Text>
            </View>
          </View>
          <View style={styles.timeRow}>
            <TouchableOpacity
              style={styles.timeButton}
              onPress={() => openTimePicker('killzone', kz.id, 'start', kz.times)}
            >
              <Text style={styles.timeLabel}>Start</Text>
              <Text style={styles.timeValue}>{formatTime(kz.times.startHour, kz.times.startMinute)}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.timeButton}
              onPress={() => openTimePicker('killzone', kz.id, 'end', kz.times)}
            >
              <Text style={styles.timeLabel}>End</Text>
              <Text style={styles.timeValue}>{formatTime(kz.times.endHour, kz.times.endMinute)}</Text>
            </TouchableOpacity>
          </View>
        </Card>
      ))}

      {/* Reset Button */}
      <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
        <Text style={styles.resetText}>Reset to Defaults</Text>
      </TouchableOpacity>

      {/* Time Picker Modal */}
      <Modal visible={timePicker.visible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Set {timePicker.field === 'start' ? 'Start' : 'End'} Time
            </Text>

            <View style={styles.pickerContainer}>
              <View style={styles.pickerColumn}>
                <TouchableOpacity style={styles.pickerBtn} onPress={() => handleTimeChange('hour', 1)}>
                  <Text style={styles.pickerBtnText}>▲</Text>
                </TouchableOpacity>
                <Text style={styles.pickerValue}>{timePicker.hour.toString().padStart(2, '0')}</Text>
                <TouchableOpacity style={styles.pickerBtn} onPress={() => handleTimeChange('hour', -1)}>
                  <Text style={styles.pickerBtnText}>▼</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.pickerSeparator}>:</Text>

              <View style={styles.pickerColumn}>
                <TouchableOpacity style={styles.pickerBtn} onPress={() => handleTimeChange('minute', 5)}>
                  <Text style={styles.pickerBtnText}>▲</Text>
                </TouchableOpacity>
                <Text style={styles.pickerValue}>{timePicker.minute.toString().padStart(2, '0')}</Text>
                <TouchableOpacity style={styles.pickerBtn} onPress={() => handleTimeChange('minute', -5)}>
                  <Text style={styles.pickerBtnText}>▼</Text>
                </TouchableOpacity>
              </View>
            </View>

            <Text style={styles.pickerPreview}>{formatTime(timePicker.hour, timePicker.minute)}</Text>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setTimePicker((prev) => ({ ...prev, visible: false }))}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalSaveBtn} onPress={saveTime}>
                <Text style={styles.modalSaveText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  loadingContainer: { flex: 1, backgroundColor: colors.bg.primary, justifyContent: 'center', alignItems: 'center' },
  loadingText: { ...typography.body, color: colors.text.secondary },

  sectionTitle: { ...typography.title, fontSize: 20, marginBottom: spacing.xs },
  sectionSubtitle: { ...typography.caption, marginBottom: spacing.md },

  timeCardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm },
  colorDot: { width: 12, height: 12, borderRadius: 6, marginRight: spacing.sm },
  timeName: { ...typography.body, fontWeight: '500' },
  timeDescription: { ...typography.caption, marginTop: 2 },
  timeRow: { flexDirection: 'row', gap: spacing.sm },
  timeButton: {
    flex: 1,
    backgroundColor: colors.bg.tertiary,
    borderRadius: radii.sm,
    padding: spacing.sm,
    alignItems: 'center',
  },
  timeLabel: { ...typography.caption, marginBottom: spacing.xs },
  timeValue: { ...typography.body, fontWeight: '600' },

  resetButton: {
    backgroundColor: '#7F1D1D',
    padding: spacing.md,
    borderRadius: radii.sm,
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  resetText: { color: '#FCA5A5', fontSize: 16 },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.bg.secondary,
    borderRadius: radii.lg,
    padding: spacing.lg,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: { ...typography.body, fontWeight: '600', marginBottom: spacing.lg },

  pickerContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md },
  pickerColumn: { alignItems: 'center' },
  pickerBtn: { padding: spacing.sm },
  pickerBtnText: { color: colors.semantic.success, fontSize: 24 },
  pickerValue: { ...typography.hero, width: 80, textAlign: 'center' },
  pickerSeparator: { ...typography.hero, marginHorizontal: spacing.sm },
  pickerPreview: { ...typography.body, color: colors.text.secondary, marginBottom: spacing.lg },

  modalActions: { flexDirection: 'row', gap: spacing.sm, width: '100%' },
  modalCancelBtn: {
    flex: 1,
    backgroundColor: colors.bg.tertiary,
    padding: spacing.md,
    borderRadius: radii.sm,
    alignItems: 'center',
  },
  modalCancelText: { ...typography.body, color: colors.text.secondary },
  modalSaveBtn: {
    flex: 1,
    backgroundColor: colors.semantic.success,
    padding: spacing.md,
    borderRadius: radii.sm,
    alignItems: 'center',
  },
  modalSaveText: { ...typography.body, color: '#FFF', fontWeight: '600' },
});
