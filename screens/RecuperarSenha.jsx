import React, { useRef, useState } from "react";
import { Text, TouchableOpacity, StyleSheet } from "react-native";
import { Bottom, Header, Input, MainContainer, validarInputs } from "../components";
import colors from "../assets/colors";

function ButtonBottom({ color, title, onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.buttonBottom, { backgroundColor: color }]}
    >
      <Text style={styles.buttonBottomText}>{title}</Text>
    </TouchableOpacity>
  );
}

export function RecuperarSenha({ navigation }) {
  const [passo, setPasso] = useState(1);
  const [email, setEmail] = useState("");
  const [codigo, setCodigo] = useState("");
  const [novaSenha, setNovaSenha] = useState("");

  const emailRef = useRef(null);
  const codigoRef = useRef(null);
  const senhaRef = useRef(null);

  function enviarCodigo() {
    const erro = validarInputs([emailRef]);
    if (erro) { alert(erro); return; }
    setPasso(2);
  }

  function confirmarCodigo() {
    const erro = validarInputs([codigoRef]);
    if (erro) { alert(erro); return; }
    setPasso(3);
  }

  function redefinirSenha() {
    const erro = validarInputs([senhaRef]);
    if (erro) { alert(erro); return; }
    alert("Senha redefinida com sucesso!");
    navigation.navigate("Login");
  }

  if (passo === 1) return (
    <MainContainer
      top={<Header title="Recuperar Senha" />}
      bottom={
        <Bottom transparent={true}>
          <ButtonBottom title="Enviar código" color={colors.secondary} onPress={enviarCodigo} />
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
      />
    </MainContainer>
  );

  if (passo === 2) return (
    <MainContainer
      top={<Header title="Recuperar Senha" />}
      bottom={
        <Bottom transparent={true}>
          <ButtonBottom title="Confirmar código" color={colors.primary} onPress={confirmarCodigo} />
          <ButtonBottom title="Reenviar código" color={colors.secondary} onPress={() => alert("Código reenviado!")} />
        </Bottom>
      }
    >
      <Input
        ref={codigoRef}
        label={`Insira o código enviado no email: ${email}`}
        placeholder="Digite código..."
        value={codigo}
        onChangeText={setCodigo}
        validationType="nome"
      />
    </MainContainer>
  );

  return (
    <MainContainer
      top={<Header title="Recuperar Senha" />}
      bottom={
        <Bottom transparent={true}>
          <ButtonBottom title="Redefinir senha!" color={colors.primary} onPress={redefinirSenha} />
        </Bottom>
      }
    >
      <Input
        ref={senhaRef}
        label="Digite sua nova senha"
        placeholder="Digite senha..."
        value={novaSenha}
        onChangeText={setNovaSenha}
        secureTextEntry
        validationType="senha"
      />
      <Text style={styles.dica}>Apenas letras e números (Ex: senha123)</Text>
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
  dica: {
    color: "#A08060",
    fontSize: 13,
    marginTop: 8,
    textAlign: "center",
  },
});