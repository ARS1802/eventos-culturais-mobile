import React from "react";
import { View, TouchableOpacity, StyleSheet, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function BottomBar({ tipo, onFiltro }) {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* Botão filtro aparece pra visitante e organizador */}
      <TouchableOpacity style={styles.botao} onPress={onFiltro}>
        <Text style={styles.icone}>≡</Text>
      </TouchableOpacity>

      {/* Botão novo evento só pro organizador */}
      {tipo === "organizador" && (
        <TouchableOpacity
          style={styles.botao}
          onPress={() => navigation.navigate("NovoEvento")}
        >
          <Text style={styles.icone}>+</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 60,
    backgroundColor: "#D1A38F",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  botao: {
    padding: 10,
  },
  icone: {
    color: "#F4EBDD",
    fontSize: 24,
    fontWeight: "bold",
  },
});