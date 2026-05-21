import React, { useRef, useState } from "react";
import { Text, TouchableOpacity, StyleSheet, View } from "react-native";
import {
  Bottom,
  Header,
  ImagePickerButton,
  Input,
  MainContainer,
  DatePicker,
  TimePicker,
  MultipleChoicePicker,
  validarInputs,
} from "../components";
import colors from "../assets/colors";
import { registerEvent } from "../backend/firebase/services/registerEvent";
import { useAuth } from "../navigation/contexts/AuthContext";

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

export function CadastroEvento({ navigation }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [themes, setThemes] = useState([]);
  const [startAtDate, setStartAtDate] = useState(null);
  const [endAtDate, setEndAtDate] = useState(null);
  const [startAtTime, setStartAtTime] = useState(null);
  const [endAtTime, setEndAtTime] = useState(null);
  const [poster, setPoster] = useState(null);
  const [erro, setErro] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { usuario, firebaseUser } = useAuth();

  const tituloRef = useRef(null);
  const descricaoRef = useRef(null);
  const enderecoRef = useRef(null);

  const temas = [
    { label: "Música", value: "musica" },
    { label: "Teatro", value: "teatro" },
    { label: "Cinema", value: "cinema" },
    { label: "Dança", value: "danca" },
    { label: "Literatura", value: "literatura" },
    { label: "Cultura local", value: "cultura_local" },
    { label: "Exposição", value: "exposicao" },
    { label: "Outros", value: "outros" },
  ];

  function voltar() {
    if (navigation.canGoBack?.()) {
      navigation.goBack();
      return;
    }

    navigation.navigate("FeedOrganizador");
  }

  function combinarDataHora(data, hora) {
    if (!data) {
      return null;
    }

    const dataCompleta = new Date(data);

    if (hora) {
      dataCompleta.setHours(hora.getHours(), hora.getMinutes(), 0, 0);
    }

    return dataCompleta;
  }

  async function concluir() {
    const erroInputs = validarInputs([tituloRef, descricaoRef, enderecoRef]);
    if (erroInputs) { setErro(erroInputs); return; }
    if (themes.length === 0) {
      setErro("Selecione ao menos um tema.");
      return;
    }
    if (!startAtDate) { setErro("Selecione a data de início."); return; }
    if (usuario?.role !== "organizer") { setErro("Apenas organizadores podem cadastrar eventos."); return; }

    const organizerId = usuario?.id ?? firebaseUser?.uid;

    if (!organizerId) { setErro("Organizador não encontrado."); return; }

    setErro("");
    setSubmitting(true);
    try {
      const startAt = combinarDataHora(startAtDate, startAtTime);
      const endAt = endAtDate ? combinarDataHora(endAtDate, endAtTime) : null;
      const result = await registerEvent(
        {
          organizerId,
          title,
          description,
          address,
          themes,
          startAt,
          endAt,
          status: "ongoing",
        },
        poster,
      );

      if (result === "FIRESTORE_ERROR") {
        setErro("Não foi possível salvar o evento.");
        return;
      }

      alert("Evento cadastrado com sucesso!");
      voltar();
    } catch (error) {
      console.error("Erro ao cadastrar evento:", error);
      setErro("Informações inválidas");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <MainContainer
      top={
        <View style={styles.topContainer}>
          <Header title="Novo Evento" />
          <TouchableOpacity
            accessibilityLabel="Voltar"
            accessibilityRole="button"
            disabled={submitting}
            onPress={voltar}
            style={[styles.voltarButton, submitting && styles.buttonDisabled]}
          >
            <Text style={styles.voltarText}>{"<"}</Text>
          </TouchableOpacity>
        </View>
      }
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
        value={title}
        onChangeText={setTitle}
        validationType="textoLivre"
      />
      <Input
        ref={descricaoRef}
        label="Descrição"
        placeholder="Faça uma breve descrição do evento..."
        value={description}
        onChangeText={setDescription}
        validationType="textoLivre"
      />
      <Input
        ref={enderecoRef}
        label="Endereço"
        placeholder="Aonde será o evento...?"
        value={address}
        onChangeText={setAddress}
        validationType="textoLivre"
      />

      <DatePicker
        label="Datas"
        startDate={startAtDate}
        endDate={endAtDate}
        onChangeStartDate={setStartAtDate}
        onChangeEndDate={setEndAtDate}
      />
      <TimePicker
        label="Horários"
        startTime={startAtTime}
        endTime={endAtTime}
        onChangeStartTime={setStartAtTime}
        onChangeEndTime={setEndAtTime}
      />

      <MultipleChoicePicker
        selected={themes}
        onChange={setThemes}
        options={temas}
      />

      <ImagePickerButton
        cor={colors.primary}
        texto={poster ? "Cartaz selecionado" : "Upload cartaz"}
        onPick={setPoster}
        style={styles.uploadButton}
      />

      {erro !== "" && (
        <Text style={styles.erro}>{erro}</Text>
      )}
    </MainContainer>
  );
}

const styles = StyleSheet.create({
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
    opacity: 0.6,
  },
  uploadButton: {
    marginTop: 16,
  },
  erro: {
    color: colors.error,
    textAlign: "center",
    marginTop: 12,
    fontSize: 14,
  },
});
