import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import COLORS from "../assets/colors";

export function Input({ label, error, secureTextEntry, ...props }) {
  const [isSecure, setIsSecure] = useState(secureTextEntry);
  {
    /* Importante para verificação se a senha está visível */
  }

  return (
    <View style={styles.container}>
      {/* Label */}
      {label && <Text style={styles.label}>{label}</Text>}

      <View style={[styles.inputContainer, error && styles.inputError]}>
        <TextInput style={styles.input} secureTextEntry={isSecure} {...props} />

        {secureTextEntry && (
          <TouchableOpacity onPress={() => setIsSecure(!isSecure)}>
            <Text style={styles.eye}>{isSecure ? "👁️" : "🙈"}</Text>
          </TouchableOpacity>
        )}
      </View>

      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
  },
  label: {
    marginBottom: 5,
    fontWeight: "bold",
    color: COLORS.text,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 10,
    backgroundColor: COLORS.accent,
    paddingHorizontal: 10,
  },
  input: {
    flex: 1,
    padding: 12,
    color: COLORS.text,
  },
  inputError: {
    borderColor: COLORS.error,
  },
  error: {
    color: COLORS.error,
    marginTop: 5,
  },
  eye: {
    fontSize: 18,
    color: COLORS.primary,
  },
});
