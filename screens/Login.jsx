import React, { useRef, useState } from "react";
import { Alert, TouchableOpacity, Text, StyleSheet } from "react-native";
import {
  Bottom,
  Header,
  Input,
  MainContainer,
  validarInputs,
} from "../components";
import colors from "../assets/colors";
import { getUser } from "../backend/firebase/services/getUser";
import { useAuth } from "../navigation/contexts/AuthContext";
import { getLoginErrorMessage } from "../utils/formatters";

function isWrongPasswordError(error) {
  return error?.code === "auth/invalid-credential" || error?.code === "auth/wrong-password";
}

function ButtonBottom({ color, title, onPress, disabled }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[styles.buttonBottom, { backgroundColor: color }, disabled && styles.buttonDisabled]}
    >
      <Text style={styles.buttonBottomText}>{title}</Text>
    </TouchableOpacity>
  );
}

function LoginButton({ onPress, disabled }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[styles.loginButton, disabled && styles.buttonDisabled]}
    >
      <Text style={styles.loginButtonText}>
        {disabled ? "Entrando..." : "Login"}
      </Text>
    </TouchableOpacity>
  );
}

export const Login = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();

  const emailRef = useRef(null);
  const senhaRef = useRef(null);

  async function entrar() {
    const erro = validarInputs([emailRef, senhaRef]);
    if (erro) { alert("Login " + erro); return; }
    if (!senha) { alert("Login " + "Senha é obrigatória"); return; }

    setSubmitting(true);
    try {
      const emailNormalizado = email.trim().toLowerCase();
      const usuarioCadastrado = await getUser({ email: emailNormalizado });

      if (!usuarioCadastrado) { alert("Login " + "Usuário não existe."); return; }

      const usuarioLogado = await login(emailNormalizado, senha, usuarioCadastrado);

      if (!usuarioLogado) { alert("Login " + "Usuário autenticado, mas não encontrado no banco de dados."); return; }

      if (usuarioCadastrado.role == "visitor") navigation.navigate("FeedVisitante");
      if (usuarioCadastrado.role == "organizer") navigation.navigate("FeedOrganizador");
    } catch (error) {
      alert("Login " + isWrongPasswordError(error) ? "Senha incorreta." : getLoginErrorMessage(error));
    } finally {
      setSubmitting(false);
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
            disabled={submitting}
            onPress={() => navigation.navigate("Cadastro")}
          />
        </Bottom>
      }
    >
      <Input
        ref={emailRef}
        label="Email"
        placeholder="Digite seu email"
        value={email}
        onChangeText={setEmail}
        validationType="email"
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <Input
        ref={senhaRef}
        label="Senha"
        placeholder="Digite sua senha"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
      />
      <TouchableOpacity
        disabled={submitting}
        onPress={() => navigation.navigate("RecuperarSenha")}
      >
        <Text style={styles.linkRecuperar}>Esqueceu sua senha?</Text>
      </TouchableOpacity>
      <LoginButton onPress={entrar} disabled={submitting} />
    </MainContainer>
  );
};

const styles = StyleSheet.create({
  buttonBottom: { paddingVertical: 12, paddingHorizontal: 20, borderRadius: 10, marginBottom: 8, minWidth: 150, alignItems: "center" },
  buttonBottomText: { color: colors.white, fontWeight: "bold" },
  loginButton: { backgroundColor: colors.primary, padding: 15, borderRadius: 10, alignItems: "center", marginTop: 10 },
  loginButtonText: { color: colors.white, fontWeight: "bold" },
  buttonDisabled: { opacity: 0.6 },
  linkRecuperar: { color: colors.primary, textDecorationLine: "underline", marginTop: 8, marginBottom: 4, fontSize: 13 },
});