import React, { ReactNode } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, typography, spacing, radii } from '../design/tokens';

interface FormModalProps {
  visible: boolean;
  title: string;
  onClose: () => void;
  onSave: () => void;
  onDelete?: () => void;
  children: ReactNode;
  saveDisabled?: boolean;
}

export function FormModal({
  visible,
  title,
  onClose,
  onSave,
  onDelete,
  children,
  saveDisabled,
}: FormModalProps) {
  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <KeyboardAvoidingView
          style={styles.keyboardView}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          {/* Header: Title and Close */}
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Text style={styles.closeBtn}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Content */}
          <ScrollView
            style={styles.content}
            contentContainerStyle={styles.contentContainer}
            keyboardShouldPersistTaps="handled"
          >
            {children}
          </ScrollView>

          {/* Bottom Actions */}
          <View style={styles.footer}>
            {onDelete && (
              <TouchableOpacity style={styles.deleteBtn} onPress={onDelete}>
                <Text style={styles.deleteText}>Delete</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[styles.saveBtn, saveDisabled && styles.saveBtnDisabled]}
              onPress={onSave}
              disabled={saveDisabled}
            >
              <Text style={[styles.saveBtnText, saveDisabled && styles.saveBtnTextDisabled]}>Save</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg.primary,
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.bg.tertiary,
  },
  title: {
    ...typography.body,
    fontWeight: '600',
    fontSize: 18,
  },
  closeBtn: {
    fontSize: 24,
    color: colors.text.tertiary,
    fontWeight: '300',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  },
  footer: {
    flexDirection: 'row',
    gap: spacing.sm,
    padding: spacing.md,
    paddingBottom: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.bg.tertiary,
    backgroundColor: colors.bg.primary,
  },
  saveBtn: {
    flex: 1,
    paddingVertical: spacing.md,
    backgroundColor: colors.semantic.success,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveBtnDisabled: {
    backgroundColor: colors.bg.tertiary,
  },
  saveBtnText: {
    ...typography.body,
    color: '#FFF',
    fontWeight: '600',
  },
  saveBtnTextDisabled: {
    color: colors.text.tertiary,
  },
  deleteBtn: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.bg.secondary,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.semantic.error,
  },
  deleteText: {
    ...typography.body,
    color: colors.semantic.error,
    fontWeight: '600',
  },
});
