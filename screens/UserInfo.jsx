import React, { useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import colors from "../assets/colors";
import { Header, MainContainer } from "../components";
import { deleteUser } from "../backend/firebase/services/deleteUser";
import { useAuth } from "../navigation/contexts/AuthContext";

const roleLabels = {
  visitor: "Visitante",
  organizer: "Organizador",
};

function InfoRow({ label, value }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value || "Não informado"}</Text>
    </View>
  );
}

export function UserInfo({ navigation }) {
  const { firebaseUser, usuario, logout } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const userId = usuario?.id ?? firebaseUser?.uid;

  async function excluirConta() {
    if (!userId) {
      alert("Usuário não encontrado.");
      return;
    }

    setSubmitting(true);

    try {
      const result = await deleteUser(userId);

      if (result === "USER_DELETED") {
        navigation.reset({
          index: 0,
          routes: [{ name: "Login" }],
        });
        return;
      }

      if (result === "REQUIRES_RECENT_LOGIN") {
        await logout();
        alert("Por segurança, faça login novamente para deletar sua conta.");
        navigation.reset({
          index: 0,
          routes: [{ name: "Login" }],
        });
        return;
      }

      if (result === "USER_NOT_FOUND") {
        alert("Perfil de usuário não encontrado no Firestore.");
        return;
      }

      alert("Não foi possível deletar sua conta.");
    } catch (error) {
      console.error("Erro ao deletar usuário:", error);
      alert("Não foi possível deletar sua conta. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  }

  function confirmarExclusao() {
    Alert.alert(
      "Deletar conta",
      "Essa ação remove seu perfil e sua conta de autenticação. Deseja continuar?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Deletar",
          style: "destructive",
          onPress: excluirConta,
        },
      ],
    );
  }

  return (
    <MainContainer top={<Header title="Minhas informações" />}>
      <View style={styles.content}>
        <InfoRow label="Nome" value={usuario?.name} />
        <InfoRow label="Email" value={usuario?.email ?? firebaseUser?.email} />
        <InfoRow
          label="Tipo de usuário"
          value={roleLabels[usuario?.role] ?? usuario?.role}
        />
        <InfoRow label="ID" value={userId} />

        <TouchableOpacity
          activeOpacity={0.8}
          disabled={submitting}
          style={[styles.deleteButton, submitting && styles.disabled]}
          onPress={confirmarExclusao}
        >
          <Text style={styles.deleteButtonText}>
            {submitting ? "Deletando..." : "Deletar conta"}
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

export default UserInfo;

const styles = StyleSheet.create({
  content: {
    paddingTop: 28,
    gap: 12,
  },
  row: {
    width: "100%",
    padding: 16,
    borderRadius: 12,
    backgroundColor: colors.white,
  },
  label: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 6,
  },
  value: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "500",
  },
  deleteButton: {
    width: "100%",
    height: 50,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
    backgroundColor: colors.error,
  },
  deleteButtonText: {
    color: colors.white,
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
