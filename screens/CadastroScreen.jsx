import React, { useRef, useState } from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import {
  Bottom,
  Header,
  Input,
  MainContainer,
  validarInputs,
  SingleChoicePicker,
} from "../components";
import colors from "../assets/colors";
import { validarConfirmacaoSenha } from "../utils/validation";

// encapsulamento das coisas que vão no Bottom
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

function CadastroButton({ onPress }) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.loginButton}>
      <Text style={styles.loginButtonText}>Cadastrar</Text>
    </TouchableOpacity>
  );
}

export const CadastroScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [erroConfirmarSenha, setErroConfirmarSenha] = useState("");

  const emailInputRef = useRef(null);
  const senhaInputRef = useRef(null);

  const [tipoUsuario, setTipoUsuario] = useState("");

  function handleButtonCadastro() {

    const erro = validarInputs([emailInputRef, senhaInputRef]);
    const erroConfirmacao = validarConfirmacaoSenha(senha, confirmarSenha);

    if (erro) {
      alert(erro);
      return;
    }

    if (erroConfirmacao) {
      setErroConfirmarSenha(erroConfirmacao);
      alert(erroConfirmacao);
      return;
    }

    if (!tipoUsuario) {
      alert("Selecione o tipo de usuario");
      return;
    }

    alert("Cadastro OK");

    console.log({
      email,
      senha,
      tipoUsuario,
    });
  }

  function handleConfirmarSenha(text) {
    setConfirmarSenha(text);
    setErroConfirmarSenha(validarConfirmacaoSenha(senha, text));
  }

  function handleSenhaChange(text) {
    setSenha(text);

    if (confirmarSenha) {
      setErroConfirmarSenha(validarConfirmacaoSenha(text, confirmarSenha));
    }
  }

  return (
    <MainContainer
      top={<Header title="Sacada Cultural" />}
      bottom={
        <Bottom transparent={false}>
          <ButtonBottom
            title="Já tenho conta"
            color={colors.primary}
            onPress={() => navigation.navigate("Login")}
          />
        </Bottom>
      }
    >
      <Input
        ref={emailInputRef}
        label="Email"
        placeholder="Digite seu email"
        value={email}
        onChangeText={setEmail}
        validationType="email"
      />
      <Input
        ref={senhaInputRef}
        label="Senha"
        placeholder="Digite sua senha"
        value={senha}
        onChangeText={handleSenhaChange}
        secureTextEntry
        validationType="senha"
      />
      <Input
        label="Confirmar senha"
        placeholder="Digite sua senha novamente"
        value={confirmarSenha}
        onChangeText={handleConfirmarSenha}
        secureTextEntry
        error={erroConfirmarSenha}
      />
      <SingleChoicePicker
        selected={tipoUsuario}
        onSelect={setTipoUsuario}
        options={[
          {
            label: "Usuário",
            description: "Quero encontrar eventos culturais",
            value: "usuario",
          },
          {
            label: "Organizador",
            description: "Quero cadastrar e gerenciar eventos",
            value: "organizador",
          },
        ]}
      />
      <CadastroButton onPress={handleButtonCadastro} />
    </MainContainer>
  );
};

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
  loginButton: {
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  loginButtonText: {
    color: colors.white,
    fontWeight: "bold",
  },
  linkContainer: {
    width: "100%",
    alignItems: "flex-end",
    marginTop: -5,
    marginBottom: 15,
  },
  linkText: {
    color: "#2F80ED",
    textDecorationLine: "underline",
    fontSize: 13,
    fontWeight: "500",
  },
});
