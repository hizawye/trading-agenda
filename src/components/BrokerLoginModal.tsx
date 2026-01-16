import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { FormModal } from '../components/FormModal';
import { matchTraderAPI } from '../lib/matchTraderAPI';
import { colors, typography, spacing, radii } from '../design/tokens';

interface BrokerLoginModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function BrokerLoginModal({ visible, onClose, onSuccess }: BrokerLoginModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [brokerId, setBrokerId] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Load saved credentials when modal opens
  useEffect(() => {
    if (visible) {
      loadSavedCredentials();
    }
  }, [visible]);

  const loadSavedCredentials = async () => {
    try {
      const savedEmail = await SecureStore.getItemAsync('broker_saved_email');
      const savedPassword = await SecureStore.getItemAsync('broker_saved_password');
      const savedBrokerId = await SecureStore.getItemAsync('broker_saved_brokerId');

      if (savedEmail) {
        setEmail(savedEmail);
        setRememberMe(true);
      }
      if (savedPassword) {
        setPassword(savedPassword);
      }
      if (savedBrokerId) {
        setBrokerId(savedBrokerId);
      }
    } catch (error) {
      console.error('Failed to load saved credentials:', error);
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Email and password are required');
      return;
    }

    setLoading(true);
    try {
      await matchTraderAPI.login({
        email,
        password,
        brokerId: brokerId || '117',
      });

      // Save credentials if remember me is enabled
      if (rememberMe) {
        await SecureStore.setItemAsync('broker_saved_email', email);
        await SecureStore.setItemAsync('broker_saved_password', password);
        await SecureStore.setItemAsync('broker_saved_brokerId', brokerId || '117');
      } else {
        // Clear saved credentials if remember me is disabled
        await SecureStore.deleteItemAsync('broker_saved_email');
        await SecureStore.deleteItemAsync('broker_saved_password');
        await SecureStore.deleteItemAsync('broker_saved_brokerId');
      }

      Alert.alert('Success', 'Connected to broker account');
      onSuccess();
      onClose();
    } catch (error: any) {
      Alert.alert(
        'Login Failed',
        error.message || 'Could not connect to broker. Check credentials and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormModal
      visible={visible}
      title="Connect Broker"
      onClose={onClose}
      onSave={handleLogin}
      saveDisabled={loading || !email || !password}
    >
      <View style={styles.form}>
        <Text style={styles.description}>
          Connect your Maven Trading Match-Trader account to automatically sync trades and view live positions.
        </Text>

        <View style={styles.field}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="your@email.com"
            placeholderTextColor={colors.text.tertiary}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            editable={!loading}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            placeholderTextColor={colors.text.tertiary}
            secureTextEntry
            editable={!loading}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Broker ID (optional)</Text>
          <TextInput
            style={styles.input}
            value={brokerId}
            onChangeText={setBrokerId}
            placeholder="117 (Maven Trading)"
            placeholderTextColor={colors.text.tertiary}
            autoCapitalize="none"
            editable={!loading}
          />
          <Text style={styles.hint}>
            Default is 117 for Maven Trading. Only change if using a different broker.
          </Text>
        </View>

        <TouchableOpacity
          style={styles.rememberMeContainer}
          onPress={() => setRememberMe(!rememberMe)}
          disabled={loading}
        >
          <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
            {rememberMe && <Text style={styles.checkmark}>✓</Text>}
          </View>
          <Text style={styles.rememberMeText}>Remember my credentials</Text>
        </TouchableOpacity>

        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator color={colors.semantic.success} />
            <Text style={styles.loadingText}>Connecting...</Text>
          </View>
        )}

        <View style={styles.note}>
          <Text style={styles.noteText}>
            🔒 Your credentials are stored securely on your device and never shared.
          </Text>
        </View>
      </View>
    </FormModal>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: spacing.lg,
  },
  description: {
    ...typography.caption,
    color: colors.text.secondary,
    lineHeight: 18,
  },
  field: {
    gap: spacing.xs,
  },
  label: {
    ...typography.caption,
    fontWeight: '600',
    color: colors.text.primary,
  },
  input: {
    ...typography.body,
    backgroundColor: colors.bg.secondary,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    color: colors.text.primary,
    borderWidth: 1,
    borderColor: colors.bg.tertiary,
  },
  hint: {
    ...typography.caption,
    color: colors.text.tertiary,
    fontSize: 11,
  },
  rememberMeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: radii.sm,
    borderWidth: 2,
    borderColor: colors.bg.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: colors.semantic.success,
    borderColor: colors.semantic.success,
  },
  checkmark: {
    color: colors.bg.primary,
    fontSize: 14,
    fontWeight: 'bold',
  },
  rememberMeText: {
    ...typography.body,
    color: colors.text.primary,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
  },
  loadingText: {
    ...typography.body,
    color: colors.text.secondary,
  },
  note: {
    backgroundColor: colors.bg.secondary,
    padding: spacing.md,
    borderRadius: radii.md,
    borderLeftWidth: 3,
    borderLeftColor: colors.semantic.success,
  },
  noteText: {
    ...typography.caption,
    color: colors.text.secondary,
    lineHeight: 16,
  },
});
