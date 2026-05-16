import React, { useRef, useState } from "react";
import { Text, TouchableOpacity, StyleSheet } from "react-native";
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
    <MainContainer
      top={<Header title="Recuperar Senha" />}
      bottom={
        <Bottom transparent={true}>
          <ButtonBottom
            title={submitting ? "Enviando..." : "Enviar código"}
            color={colors.secondary}
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
  );
}
const styles = StyleSheet.create({
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
