import React, { useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  Bottom,
  Header,
  Input,
  MainContainer,
  validarInputs,
} from "../components";
import colors from "../assets/colors";
import { getUser } from "../backend/firebase/services/getUser";
import { resetPassword } from "../backend/firebase/services/resetPassword";

function ButtonBottom({ color, title, onPress, disabled }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.buttonBottom,
        { backgroundColor: color },
        disabled && styles.buttonDisabled,
      ]}
    >
      <Text style={styles.buttonBottomText}>{title}</Text>
    </TouchableOpacity>
  );
}

export function RecuperarSenha({ navigation }) {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const emailRef = useRef(null);

  function voltar() {
    if (navigation.canGoBack?.()) {
      navigation.goBack();
      return;
    }

    navigation.navigate("Login");
  }

  async function enviarCodigo() {
    const erro = validarInputs([emailRef]);
    if (erro) {
      alert(erro);
      return;
    }

    const emailNormalizado = email.trim().toLowerCase();
    setSubmitting(true);
    try {
      const usuario = await getUser({ email: emailNormalizado });
      if (!usuario) {
        alert("Nenhum usuário encontrado com esse email.");
        return;
      }
      await resetPassword(usuario.email);
      alert(`Cheque a caixa de entrada do email ${emailNormalizado}.`);
      navigation.navigate("Login");
    } catch (error) {
      alert("Não foi possível buscar o usuário. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.keyboardAvoiding}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <MainContainer
        top={
          <View style={styles.topContainer}>
            <Header title="Recuperar Senha" />
            <TouchableOpacity
              accessibilityLabel="Voltar"
              accessibilityRole="button"
              onPress={voltar}
              style={styles.voltarButton}
            >
              <Text style={styles.voltarText}>{"<"}</Text>
            </TouchableOpacity>
          </View>
        }
        bottom={
          <Bottom transparent={true}>
            <ButtonBottom
              title={submitting ? "Enviando..." : "Enviar código"}
              color={colors.secondaryContrast}
              onPress={enviarCodigo}
              disabled={submitting}
            />
          </Bottom>
        }
      >
        <Input
          ref={emailRef}
          label="Insira o email cadastrado"
          placeholder="Digite email..."
          value={email}
          onChangeText={setEmail}
          validationType="email"
          autoCapitalize="none"
          keyboardType="email-address"
        />
      </MainContainer>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardAvoiding: {
    flex: 1,
  },
  topContainer: {
    width: "100%",
  },
  voltarButton: {
    position: "absolute",
    left: 16,
    top: 13,
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 20,
  },
  voltarText: {
    color: colors.white,
    fontSize: 26,
    fontWeight: "800",
  },
  buttonBottom: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 8,
    minWidth: 150,
    alignItems: "center",
  },
  buttonBottomText: {
    color: colors.white,
    fontWeight: "bold",
  },
  buttonDisabled: {
    opacity: 0.7,
  },
});
