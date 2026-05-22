import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import colors from "../assets/colors";
import { Header, MainContainer } from "../components";
import { useAuth } from "../navigation/contexts/AuthContext";

export function ConfigUser({ navigation }) {
  const { logout, usuario } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  async function handleLogout() {
    setSubmitting(true);

    try {
      await logout();
      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
    } catch (error) {
      console.error("Erro ao sair:", error);
      alert("Não foi possível sair. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <MainContainer top={<Header title="Configurações" />}>
      <View style={styles.content}>
        <Text style={styles.title}>Olá, {usuario?.name ?? "usuário"}</Text>
        <Text style={styles.subtitle}>
          Gerencie seus dados de conta e sua sessão.
        </Text>

        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.primaryButton}
          onPress={() => navigation.navigate("UserInfo")}
        >
          <Text style={styles.primaryButtonText}>Minhas informações</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          disabled={submitting}
          style={[styles.logoutButton, submitting && styles.disabled]}
          onPress={handleLogout}
        >
          <Text style={styles.logoutButtonText}>
            {submitting ? "Saindo..." : "Fazer logout"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          disabled={submitting}
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    </MainContainer>
  );
}

export default ConfigUser;

const styles = StyleSheet.create({
  content: {
    paddingTop: 32,
    gap: 14,
  },
  title: {
    color: colors.text,
    fontSize: 22,
    fontWeight: "800",
  },
  subtitle: {
    color: colors.text,
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 12,
  },
  primaryButton: {
    width: "100%",
    height: 50,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
  },
  primaryButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "700",
  },
  logoutButton: {
    width: "100%",
    height: 50,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: colors.background,
  },
  logoutButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: "700",
  },
  backButton: {
    width: "100%",
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  backButtonText: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "700",
  },
  disabled: {
    opacity: 0.6,
  },
});
