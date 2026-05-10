import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

export function Button({ cor, texto, onPress, style }) {
  return (
    <TouchableOpacity
      style={[styles.botao, { backgroundColor: cor }, style]}
      onPress={onPress}
    >
      <Text style={styles.texto}>{texto}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  botao: {
    width: "100%",
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  texto: {
    color: "#F4EBDD",
    fontSize: 16,
    fontWeight: "bold",
  },
});
