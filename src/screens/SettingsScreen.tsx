import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
} from 'react-native';
import { useSettingsStore } from '../stores/settingsStore';
import { TimeRange, Session, Killzone } from '../types';

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
        const newHour = (prev.hour + delta + 24) % 24;
        return { ...prev, hour: newHour };
      } else {
        const newMinute = (prev.minute + delta + 60) % 60;
        return { ...prev, minute: newMinute };
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
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading settings...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Sessions Section */}
      <Text style={styles.sectionTitle}>Session Times</Text>
      <Text style={styles.sectionSubtitle}>All times in NY timezone (EST/EDT)</Text>

      {sessions.map((session) => (
        <View key={session.id} style={styles.timeCard}>
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
        </View>
      ))}

      {/* Killzones Section */}
      <Text style={[styles.sectionTitle, { marginTop: 32 }]}>Killzone Times</Text>
      <Text style={styles.sectionSubtitle}>Precise trading windows for entries</Text>

      {killzones.map((kz) => (
        <View key={kz.id} style={styles.timeCard}>
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
        </View>
      ))}

      {/* Reset Button */}
      <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
        <Text style={styles.resetText}>Reset to Defaults</Text>
      </TouchableOpacity>

      <View style={{ height: 40 }} />

      {/* Time Picker Modal */}
      <Modal visible={timePicker.visible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Set {timePicker.field === 'start' ? 'Start' : 'End'} Time
            </Text>

            <View style={styles.pickerContainer}>
              {/* Hour */}
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

              {/* Minute */}
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  content: { padding: 16 },
  loadingText: { color: '#94A3B8', textAlign: 'center', marginTop: 100 },

  sectionTitle: { color: '#F1F5F9', fontSize: 20, fontWeight: '600', marginBottom: 4 },
  sectionSubtitle: { color: '#64748B', fontSize: 14, marginBottom: 16 },

  timeCard: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  timeCardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  colorDot: { width: 12, height: 12, borderRadius: 6, marginRight: 10 },
  timeName: { color: '#F1F5F9', fontSize: 16, fontWeight: '500' },
  timeDescription: { color: '#64748B', fontSize: 12, marginTop: 2 },
  timeRow: { flexDirection: 'row', gap: 12 },
  timeButton: {
    flex: 1,
    backgroundColor: '#334155',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  timeLabel: { color: '#94A3B8', fontSize: 12, marginBottom: 4 },
  timeValue: { color: '#F1F5F9', fontSize: 16, fontWeight: '600' },

  resetButton: {
    backgroundColor: '#7F1D1D',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  resetText: { color: '#FCA5A5', fontSize: 16 },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 24,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: { color: '#F1F5F9', fontSize: 18, fontWeight: '600', marginBottom: 24 },

  pickerContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  pickerColumn: { alignItems: 'center' },
  pickerBtn: { padding: 12 },
  pickerBtnText: { color: '#10B981', fontSize: 24 },
  pickerValue: { color: '#F1F5F9', fontSize: 48, fontWeight: '300', width: 80, textAlign: 'center' },
  pickerSeparator: { color: '#F1F5F9', fontSize: 48, fontWeight: '300', marginHorizontal: 8 },
  pickerPreview: { color: '#94A3B8', fontSize: 16, marginBottom: 24 },

  modalActions: { flexDirection: 'row', gap: 12, width: '100%' },
  modalCancelBtn: {
    flex: 1,
    backgroundColor: '#334155',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalCancelText: { color: '#94A3B8', fontSize: 16 },
  modalSaveBtn: {
    flex: 1,
    backgroundColor: '#10B981',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalSaveText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
});
