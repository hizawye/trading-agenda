import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Switch,
  TouchableOpacity,
  Modal,
  TextInput,
} from 'react-native';
import { useAlertStore } from '../stores/alertStore';
import { Alert } from '../types';
import { formatTime } from '../lib/utils';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function AlertsScreen() {
  const { alerts, loadAlerts, addAlert, updateAlert, toggleAlert, deleteAlert } = useAlertStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingAlert, setEditingAlert] = useState<Alert | null>(null);

  const [time, setTime] = useState('07:30');
  const [label, setLabel] = useState('');
  const [description, setDescription] = useState('');
  const [days, setDays] = useState<number[]>([1, 2, 3, 4, 5]);

  useEffect(() => {
    loadAlerts();
  }, []);

  const resetForm = () => {
    setTime('07:30');
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
    setTime(alert.time);
    setLabel(alert.label);
    setDescription(alert.description || '');
    setDays(alert.days);
    setModalVisible(true);
  };

  const handleSave = async () => {
    const alertData = { time, label, description, days, enabled: true };

    if (editingAlert) {
      await updateAlert({ ...editingAlert, ...alertData });
    } else {
      await addAlert(alertData);
    }

    setModalVisible(false);
    resetForm();
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
            <Text
              key={d}
              style={[styles.dayText, item.days.includes(i) && styles.dayActive]}
            >
              {d}
            </Text>
          ))}
        </View>
      </View>
      <Switch
        value={item.enabled}
        onValueChange={() => toggleAlert(item.id)}
        trackColor={{ false: '#334155', true: '#065F46' }}
        thumbColor={item.enabled ? '#10B981' : '#64748B'}
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

      <TouchableOpacity style={styles.fab} onPress={openAddModal}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.modal}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.cancelBtn}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>{editingAlert ? 'Edit Alert' : 'New Alert'}</Text>
            <TouchableOpacity onPress={handleSave}>
              <Text style={styles.saveBtn}>Save</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Time (24h format)</Text>
          <TextInput
            style={styles.input}
            value={time}
            onChangeText={setTime}
            placeholder="07:30"
            placeholderTextColor="#64748B"
          />

          <Text style={styles.label}>Label</Text>
          <TextInput
            style={styles.input}
            value={label}
            onChangeText={setLabel}
            placeholder="Position before liquidity"
            placeholderTextColor="#64748B"
          />

          <Text style={styles.label}>Description (optional)</Text>
          <TextInput
            style={styles.input}
            value={description}
            onChangeText={setDescription}
            placeholder="Details about this alert"
            placeholderTextColor="#64748B"
          />

          <Text style={styles.label}>Days</Text>
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

          {editingAlert && (
            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={() => {
                deleteAlert(editingAlert.id);
                setModalVisible(false);
              }}
            >
              <Text style={styles.deleteText}>Delete Alert</Text>
            </TouchableOpacity>
          )}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  list: { padding: 16 },
  alertCard: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  alertLeft: { flex: 1, marginRight: 16 },
  alertTime: { color: '#10B981', fontSize: 28, fontWeight: 'bold' },
  alertLabel: { color: '#F1F5F9', fontSize: 16, marginTop: 4 },
  alertDesc: { color: '#64748B', fontSize: 14, marginTop: 2 },
  daysRow: { flexDirection: 'row', marginTop: 8, gap: 6 },
  dayText: { color: '#475569', fontSize: 12 },
  dayActive: { color: '#10B981', fontWeight: '600' },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabText: { color: '#FFF', fontSize: 32, marginTop: -2 },

  modal: { flex: 1, backgroundColor: '#0F172A', padding: 16 },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    paddingTop: 16,
  },
  cancelBtn: { color: '#EF4444', fontSize: 16 },
  saveBtn: { color: '#10B981', fontSize: 16, fontWeight: '600' },
  modalTitle: { color: '#F1F5F9', fontSize: 18, fontWeight: '600' },
  label: { color: '#94A3B8', fontSize: 14, marginBottom: 8, marginTop: 16 },
  input: {
    backgroundColor: '#1E293B',
    borderRadius: 8,
    padding: 14,
    color: '#F1F5F9',
    fontSize: 16,
  },
  daysSelector: { flexDirection: 'row', gap: 8 },
  dayBtn: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: '#334155',
    borderRadius: 8,
    alignItems: 'center',
  },
  dayBtnActive: { backgroundColor: '#10B981' },
  dayBtnText: { color: '#94A3B8', fontSize: 12, fontWeight: '600' },
  dayBtnTextActive: { color: '#FFF' },
  deleteBtn: {
    backgroundColor: '#7F1D1D',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 32,
  },
  deleteText: { color: '#FCA5A5', fontSize: 16 },
});
