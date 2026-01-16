import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Switch, TouchableOpacity, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useAlertStore } from '../stores/alertStore';
import { Alert } from '../types';
import { formatTime } from '../lib/utils';
import { colors, typography, spacing, radii } from '../design/tokens';
import { FormModal } from '../components/FormModal';
import { FormField, FormLabel } from '../components/FormField';
import { FAB } from '../components/FAB';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function AlertsScreen() {
  const { alerts, loadAlerts, addAlert, updateAlert, toggleAlert, deleteAlert } = useAlertStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingAlert, setEditingAlert] = useState<Alert | null>(null);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [label, setLabel] = useState('');
  const [description, setDescription] = useState('');
  const [days, setDays] = useState<number[]>([1, 2, 3, 4, 5]);
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    loadAlerts();
  }, []);

  const resetForm = () => {
    const defaultTime = new Date();
    defaultTime.setHours(7, 30, 0, 0);
    setSelectedDate(defaultTime);
    setLabel('');
    setDescription('');
    setDays([1, 2, 3, 4, 5]);
    setEditingAlert(null);
  };

  const openAddModal = () => {
    resetForm();
    setModalVisible(true);
  };

  const openEditModal = (alert: Alert) => {
    setEditingAlert(alert);
    const [hours, minutes] = alert.time.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    setSelectedDate(date);
    setLabel(alert.label);
    setDescription(alert.description || '');
    setDays(alert.days);
    setModalVisible(true);
  };

  const handleSave = async () => {
    const hours = selectedDate.getHours().toString().padStart(2, '0');
    const minutes = selectedDate.getMinutes().toString().padStart(2, '0');
    const time = `${hours}:${minutes}`;

    const alertData = { time, label, description, days, enabled: true };

    if (editingAlert) {
      await updateAlert({ ...editingAlert, ...alertData });
    } else {
      await addAlert(alertData);
    }

    setModalVisible(false);
    resetForm();
  };

  const handleDelete = () => {
    if (editingAlert) {
      deleteAlert(editingAlert.id);
      setModalVisible(false);
      resetForm();
    }
  };

  const toggleDay = (day: number) => {
    setDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day].sort()
    );
  };

  const renderAlert = ({ item }: { item: Alert }) => (
    <TouchableOpacity style={styles.alertCard} onPress={() => openEditModal(item)}>
      <View style={styles.alertLeft}>
        <Text style={styles.alertTime}>{formatTime(item.time)}</Text>
        <Text style={styles.alertLabel}>{item.label}</Text>
        {item.description && <Text style={styles.alertDesc}>{item.description}</Text>}
        <View style={styles.daysRow}>
          {DAYS.map((d, i) => (
            <Text key={d} style={[styles.dayText, item.days.includes(i) && styles.dayActive]}>
              {d}
            </Text>
          ))}
        </View>
      </View>
      <Switch
        value={item.enabled}
        onValueChange={() => toggleAlert(item.id)}
        trackColor={{ false: colors.bg.tertiary, true: '#065F46' }}
        thumbColor={item.enabled ? colors.semantic.success : colors.text.tertiary}
      />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={alerts}
        keyExtractor={(item) => item.id}
        renderItem={renderAlert}
        contentContainerStyle={styles.list}
      />

      <FAB onPress={openAddModal} />

      <FormModal
        visible={modalVisible}
        title={editingAlert ? 'Edit Alert' : 'New Alert'}
        onClose={() => setModalVisible(false)}
        onSave={handleSave}
        onDelete={editingAlert ? handleDelete : undefined}
        saveDisabled={!label.trim() || days.length === 0}
      >
        <FormLabel>Time</FormLabel>
        <TouchableOpacity
          style={styles.timePickerButton}
          onPress={() => setShowPicker(true)}
        >
          <Text style={styles.timePickerText}>
            {selectedDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
          </Text>
        </TouchableOpacity>

        {showPicker && (
          <DateTimePicker
            value={selectedDate}
            mode="time"
            is24Hour={true}
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(_event, date) => {
              setShowPicker(Platform.OS === 'ios');
              if (date) setSelectedDate(date);
            }}
          />
        )}

        <FormField
          label="Label"
          value={label}
          onChangeText={setLabel}
          placeholder="Position before liquidity"
        />

        <FormField
          label="Description (optional)"
          value={description}
          onChangeText={setDescription}
          placeholder="Details about this alert"
        />

        <FormLabel>Days</FormLabel>
        <View style={styles.daysSelector}>
          {DAYS.map((d, i) => (
            <TouchableOpacity
              key={d}
              style={[styles.dayBtn, days.includes(i) && styles.dayBtnActive]}
              onPress={() => toggleDay(i)}
            >
              <Text style={[styles.dayBtnText, days.includes(i) && styles.dayBtnTextActive]}>
                {d}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </FormModal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg.primary },
  list: { padding: spacing.md },
  alertCard: {
    backgroundColor: colors.bg.secondary,
    borderRadius: radii.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  alertLeft: { flex: 1, marginRight: spacing.md },
  alertTime: {
    color: colors.semantic.success,
    fontSize: 28,
    fontWeight: 'bold',
  },
  alertLabel: {
    ...typography.body,
    marginTop: spacing.xs,
  },
  alertDesc: {
    ...typography.caption,
    color: colors.text.tertiary,
    marginTop: 2,
  },
  daysRow: {
    flexDirection: 'row',
    marginTop: spacing.sm,
    gap: 6,
  },
  dayText: {
    ...typography.caption,
    color: colors.text.tertiary,
  },
  dayActive: {
    color: colors.semantic.success,
    fontWeight: '600',
  },
  daysSelector: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  dayBtn: {
    flex: 1,
    paddingVertical: spacing.sm,
    backgroundColor: colors.bg.tertiary,
    borderRadius: radii.sm,
    alignItems: 'center',
  },
  dayBtnActive: {
    backgroundColor: colors.semantic.success,
  },
  dayBtnText: {
    ...typography.caption,
    fontWeight: '600',
  },
  dayBtnTextActive: {
    color: '#FFF',
  },
  timePickerButton: {
    backgroundColor: colors.bg.tertiary,
    borderRadius: radii.sm,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  timePickerText: {
    ...typography.body,
    textAlign: 'center',
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.semantic.success,
  },
});
