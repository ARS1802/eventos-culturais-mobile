import React from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import colors from "../assets/colors";

export function ConfirmDeletion({
  visible,
  title = "Excluir evento",
  message = "Esta ação remove o evento e o cartaz principal definitivamente.",
  cancelText = "Cancelar",
  confirmText = "Excluir",
  loading = false,
  onCancel,
  onConfirm,
}) {
  function handleCancel() {
    if (!loading) {
      onCancel?.();
    }
  }

  function handleConfirm() {
    if (!loading) {
      onConfirm?.();
    }
  }

  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={handleCancel}
    >
      <View style={styles.overlay}>
        <Pressable
          accessibilityLabel="Cancelar exclusão"
          disabled={loading}
          onPress={handleCancel}
          style={StyleSheet.absoluteFill}
        />

        <View
          accessibilityRole="alert"
          accessible
          style={styles.dialog}
        >
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>

          <View style={styles.actions}>
            <TouchableOpacity
              accessibilityRole="button"
              activeOpacity={0.82}
              disabled={loading}
              onPress={handleCancel}
              style={[styles.button, styles.cancelButton]}
            >
              <Text style={styles.cancelText}>{cancelText}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              accessibilityRole="button"
              activeOpacity={0.82}
              disabled={loading}
              onPress={handleConfirm}
              style={[
                styles.button,
                styles.confirmButton,
                loading && styles.disabledButton,
              ]}
            >
              {loading ? (
                <ActivityIndicator color={colors.white} size="small" />
              ) : (
                <Text style={styles.confirmText}>{confirmText}</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

export default ConfirmDeletion;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    backgroundColor: "rgba(0, 0, 0, 0.38)",
  },
  dialog: {
    width: "100%",
    maxWidth: 340,
    borderRadius: 8,
    padding: 18,
    gap: 14,
    backgroundColor: colors.background,
  },
  title: {
    color: colors.primary,
    fontSize: 19,
    fontWeight: "900",
    textAlign: "center",
  },
  message: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 20,
    textAlign: "center",
  },
  actions: {
    flexDirection: "row",
    gap: 10,
  },
  button: {
    flex: 1,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 7,
    paddingHorizontal: 12,
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: colors.white,
  },
  confirmButton: {
    backgroundColor: colors.error,
  },
  disabledButton: {
    opacity: 0.65,
  },
  cancelText: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: "900",
  },
  confirmText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: "900",
  },
});
