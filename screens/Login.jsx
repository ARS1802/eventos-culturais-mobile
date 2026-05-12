import React, { useState } from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { Bottom, Header, Input, MainContainer } from "../components";
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

function LoginButton({ onPress }) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.loginButton}>
      <Text style={styles.loginButtonText}>Login</Text>
    </TouchableOpacity>
  );
}

export const Login = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erroEmail, setErroEmail] = useState("");
  const [erroSenha, setErroSenha] = useState("");

  function validar() {
    let valido = true;

    if (email === "") {
      setErroEmail("Email é obrigatório");
      valido = false;
    } else {
      setErroEmail("");
    }

    if (senha === "") {
      setErroSenha("Senha é obrigatória");
      valido = false;
    } else {
      setErroSenha("");
    }

    if (valido) {
      alert("Login OK!");
    } else {
      alert("Preencha os campos corretamente");
    }
  }

  return (
  <MainContainer
    top={<Header title="Sacada Cultural" />}
    bottom={
      <Bottom transparent={true}>
        <ButtonBottom
          title="Cadastre-se!"
          color={colors.primary}
          onPress={() => alert("segue para CadastroScreen")}
        />
      </Bottom>
    }
  >
    <Input
      label="Email"
      placeholder="Digite seu email"
      value={email}
      onChangeText={setEmail}
      error={erroEmail}
    />
    <Input
      label="Senha"
      placeholder="Digite sua senha"
      value={senha}
      onChangeText={setSenha}
      secureTextEntry
      error={erroSenha}
    />
    <TouchableOpacity onPress={() => navigation.navigate("RecuperarSenha")}>
      <Text style={styles.linkRecuperar}>Esqueceu sua senha?</Text>
    </TouchableOpacity>
    <LoginButton onPress={validar} />
  </MainContainer>
);};

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
  linkRecuperar: {
    color: colors.primary,
    textDecorationLine: "underline",
    marginTop: 8,
    marginBottom: 4,
    fontSize: 13,
  },
});