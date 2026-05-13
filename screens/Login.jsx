import React, { useRef, useState } from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";
import {
  Bottom,
  Header,
  Input,
  MainContainer,
  validarInputs,
} from "../components";
import colors from "../assets/colors";

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

  const emailInputRef = useRef(null);
  const senhaInputRef = useRef(null);

  function handleButtonEntrar() {

    const erro = validarInputs([emailInputRef, senhaInputRef]);

    if (erro) {
      alert(erro);
      return;
    }

    alert("Login OK 🚀");

    console.log({
      email,
      senha,
    });
  }

  return (
    <MainContainer
      top={<Header title="Sacada Cultural" />}
      bottom={
        <Bottom transparent={true}>
          <ButtonBottom
            title="Cadastre-se!"
            color={colors.primary}
            onPress={() => navigation.navigate("Cadastro")}
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
        onChangeText={setSenha}
        secureTextEntry
        validationType="senha"
      />
      <View style={styles.linkContainer}>

  <TouchableOpacity
    onPress={() =>
      alert("Ir para Recuperar Senha")
    }
  >
    <Text style={styles.linkText}>
      Esqueceu sua senha?
    </Text>
  </TouchableOpacity>

    </View>

      <LoginButton onPress={handleButtonEntrar} />
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
