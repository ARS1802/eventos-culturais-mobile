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
import { registerUser } from "../backend/firebase/services/registerUser";
import { getUser } from "../backend/firebase/services/getUser";
import { useAuth } from "../navigation/contexts/AuthContext";

const cadastroErrorMessages = {
  EMAIL_EXISTS: "Este email já está cadastrado.",
  INVALID_EMAIL: "Email inválido.",
  WEAK_PASSWORD: "A senha é muito fraca.",
  AUTH_CONFIG_ERROR: "A autenticação ainda não foi configurada no Firebase.",
  FIRESTORE_ERROR: "Usuário criado, mas não foi possível salvar o perfil.",
  AUTH_ERROR: "Não foi possível cadastrar. Tente novamente.",
};

function getCadastroErrorMessage(result) {
  return cadastroErrorMessages[result] ?? "";
}

// encapsulamento das coisas que vão no Bottom
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

function CadastroButton({ onPress, disabled }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[styles.loginButton, disabled && styles.buttonDisabled]}
    >
      <Text style={styles.loginButtonText}>
        {disabled ? "Cadastrando..." : "Cadastrar"}
      </Text>
    </TouchableOpacity>
  );
}

export const Cadastro = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [nome, setNome] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [erroConfirmarSenha, setErroConfirmarSenha] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { definirUsuarioAtual } = useAuth();

  const emailInputRef = useRef(null);
  const senhaInputRef = useRef(null);
  const nomeInputRef = useRef(null);

  const [tipoUsuario, setTipoUsuario] = useState("");

  async function handleButtonCadastro() {
    const erro = validarInputs([emailInputRef, senhaInputRef, nomeInputRef]);
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

    setSubmitting(true);

    try {
      const emailNormalizado = email.trim().toLowerCase();
      const uid = await registerUser({
        name: nome.trim(),
        email: emailNormalizado,
        password: senha,
        role: tipoUsuario,
      });

      const mensagemErro = getCadastroErrorMessage(uid);

      if (mensagemErro) {
        alert(mensagemErro);
        return;
      }

      const usuarioCriado = await getUser({ id: uid });

      if (!usuarioCriado) {
        alert("Cadastro criado, mas o perfil não foi encontrado no banco.");
        return;
      }

      await definirUsuarioAtual(usuarioCriado);

      alert("Cadastro realizado com sucesso.");

      if (usuarioCriado.role === "visitor") {
        navigation.navigate("FeedVisitante");
        return;
      }

      if (usuarioCriado.role === "organizer") {
        navigation.navigate("FeedOrganizador");
      }
    } catch (e) {
      console.error("Erro ao cadastrar usuário:", e);
      alert("Não foi possível cadastrar. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
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
            disabled={submitting}
            onPress={() => navigation.navigate("Login")}
          />
        </Bottom>
      }
    >
      <Input
        ref={nomeInputRef}
        label="Nome"
        placeholder="Qual seu nome?"
        value={nome}
        onChangeText={setNome}
        validationType="nome"
      />
      <Input
        ref={emailInputRef}
        label="Email"
        placeholder="Digite seu email"
        value={email}
        onChangeText={setEmail}
        validationType="email"
        autoCapitalize="none"
        keyboardType="email-address"
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
            label: "Visitante",
            description: "Quero encontrar eventos culturais",
            value: "visitor",
          },
          {
            label: "Organizador",
            description: "Quero cadastrar e gerenciar eventos",
            value: "organizer",
          },
        ]}
      />
      <CadastroButton onPress={handleButtonCadastro} disabled={submitting} />
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
  buttonDisabled: {
    opacity: 0.6,
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
