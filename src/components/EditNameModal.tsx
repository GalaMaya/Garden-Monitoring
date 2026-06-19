import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Pressable,
} from 'react-native';
import { Colors, FontSizes, FontWeights, Spacing, BorderRadius } from '../constants/colors';

interface EditNameModalProps {
  visible: boolean;
  currentName: string;
  onSave: (newName: string) => Promise<boolean>;
  onClose: () => void;
}

/**
 * Modal for editing device name with high contrast UI
 */
export const EditNameModal: React.FC<EditNameModalProps> = ({
  visible,
  currentName,
  onSave,
  onClose,
}) => {
  const [inputValue, setInputValue] = useState(currentName);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset input when modal opens
  React.useEffect(() => {
    if (visible) {
      setInputValue(currentName);
      setError(null);
    }
  }, [visible, currentName]);

  const handleSave = async () => {
    const trimmedName = inputValue.trim();
    
    if (!trimmedName) {
      setError('Nama tidak boleh kosong');
      return;
    }

    if (trimmedName.length > 50) {
      setError('Nama terlalu panjang (maksimal 50 karakter)');
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const success = await onSave(trimmedName);
      if (success) {
        onClose();
      } else {
        setError('Gagal menyimpan nama. Silakan coba lagi.');
      }
    } catch {
      setError('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      {/* Backdrop */}
      <Pressable style={styles.backdrop} onPress={onClose}>
        {/* Modal Content */}
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>✏️ Edit Nama Perangkat</Text>
          </View>

          {/* Input Field */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Nama Baru:</Text>
            <TextInput
              style={[
                styles.input,
                error && styles.inputError,
              ]}
              value={inputValue}
              onChangeText={setInputValue}
              placeholder="Masukkan nama perangkat"
              placeholderTextColor={Colors.textSecondary}
              maxLength={50}
              autoFocus
              editable={!isSaving}
            />
            
            {/* Error Message */}
            {error && <Text style={styles.errorText}>{error}</Text>}
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onClose}
              disabled={isSaving}
            >
              <Text style={styles.cancelButtonText}>BATAL</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.button,
                styles.saveButton,
                isSaving && styles.buttonDisabled,
              ]}
              onPress={handleSave}
              disabled={isSaving}
            >
              <Text style={styles.saveButtonText}>
                {isSaving ? 'MENYIMPAN...' : 'SIMPAN'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  modalContent: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.xl,
    borderWidth: 3,
    borderColor: Colors.border,
    width: '100%',
    maxWidth: 400,
    padding: Spacing.xl,
  },
  header: {
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
  },
  inputContainer: {
    marginBottom: Spacing.lg,
  },
  label: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  input: {
    backgroundColor: Colors.surface,
    borderWidth: 2,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    fontSize: FontSizes.md,
    color: Colors.textPrimary,
    minHeight: 50,
  },
  inputError: {
    borderColor: Colors.error,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  errorText: {
    color: Colors.error,
    fontSize: FontSizes.sm,
    marginTop: Spacing.sm,
    fontWeight: FontWeights.medium,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  button: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
  },
  cancelButton: {
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
  },
  cancelButtonText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
  },
  saveButton: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primaryDark,
  },
  saveButtonText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
    color: Colors.textOnPrimary,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});

export default EditNameModal;
