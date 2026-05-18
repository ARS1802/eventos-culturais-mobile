import React, { useRef, useState } from "react";
import { Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import {
  Bottom,
  Header,
  Input,
  MainContainer,
  DatePicker,
  SingleChoicePicker,
  validarInputs,
} from "../components";
import colors from "../assets/colors";

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

export function CadastroEvento({ navigation }) {
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [endereco, setEndereco] = useState("");
  const [tema, setTema] = useState("");
  const [erro, setErro] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const tituloRef = useRef(null);
  const descricaoRef = useRef(null);
  const enderecoRef = useRef(null);

  const temas = [
    { label: "Infantil", value: "infantil" },
    { label: "Tragédia", value: "tragedia" },
    { label: "Comédia", value: "comedia" },
    { label: "Musical", value: "musical" },
    { label: "Arte Visual", value: "arte_visual" },
  ];

  async function concluir() {
    const erroInputs = validarInputs([tituloRef, descricaoRef, enderecoRef]);
    if (erroInputs) { setErro(erroInputs); return; }
    if (!tema) { setErro("Selecione um tema."); return; }

    setErro("");
    setSubmitting(true);
    try {
      // integração Firebase vai aqui
      alert("Evento cadastrado com sucesso!");
      navigation.goBack();
    } catch (error) {
      setErro("Informações inválidas");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <MainContainer
      top={<Header title="Novo Evento" />}
      bottom={
        <Bottom transparent={true}>
          <ButtonBottom
            title={submitting ? "Salvando..." : "Concluir!"}
            color={colors.secondary}
            onPress={concluir}
            disabled={submitting}
          />
        </Bottom>
      }
    >
      <Input
        ref={tituloRef}
        label="Título"
        placeholder="Digite o título do evento..."
        value={titulo}
        onChangeText={setTitulo}
        validationType="textoLivre"
      />
      <Input
        ref={descricaoRef}
        label="Descrição"
        placeholder="Faça uma breve descrição do evento..."
        value={descricao}
        onChangeText={setDescricao}
        validationType="textoLivre"
      />
      <Input
        ref={enderecoRef}
        label="Endereço"
        placeholder="Aonde será o evento...?"
        value={endereco}
        onChangeText={setEndereco}
        validationType="textoLivre"
      />

      <DatePicker label="Datas" />
      <DatePicker label="Horários" />

      <SingleChoicePicker
        selected={tema}
        onSelect={setTema}
        options={temas}
      />

      <TouchableOpacity style={styles.uploadButton}>
        <Text style={styles.uploadText}>Upload cartaz 📷</Text>
      </TouchableOpacity>

      {erro !== "" && (
        <Text style={styles.erro}>{erro}</Text>
      )}
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
    opacity: 0.6,
  },
  uploadButton: {
    backgroundColor: colors.accent,
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 16,
  },
  uploadText: {
    color: colors.primary,
    fontWeight: "bold",
  },
  erro: {
    color: colors.error,
    textAlign: "center",
    marginTop: 12,
    fontSize: 14,
  },
});