import React, { useRef, useState } from "react";
import { Text, TouchableOpacity, StyleSheet } from "react-native";
import {
  Bottom,
  Header,
  ImagePickerButton,
  Input,
  MainContainer,
  DatePicker,
  SingleChoicePicker,
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
  const [dataInicio, setDataInicio] = useState(null);
  const [dataFim, setDataFim] = useState(null);
  const [horaInicio, setHoraInicio] = useState(null);
  const [horaFim, setHoraFim] = useState(null);
  const [cartaz, setCartaz] = useState(null);
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
    if (!tema) { setErro("Selecione um tema."); return; }
    if (!dataInicio) { setErro("Selecione a data de início."); return; }
    if (usuario?.role !== "organizer") { setErro("Apenas organizadores podem cadastrar eventos."); return; }

    const organizerId = usuario?.id ?? firebaseUser?.uid;

    if (!organizerId) { setErro("Organizador não encontrado."); return; }

    setErro("");
    setSubmitting(true);
    try {
      const eventStartAt = combinarDataHora(dataInicio, horaInicio);
      const eventEndAt = dataFim ? combinarDataHora(dataFim, horaFim) : null;
      const result = await registerEvent(
        {
          organizerId,
          title: titulo,
          description: descricao,
          address: endereco,
          themes: [tema],
          startAt: eventStartAt,
          endAt: eventEndAt,
          status: "ongoing",
        },
        cartaz,
      );

      if (result === "FIRESTORE_ERROR") {
        setErro("Não foi possível salvar o evento.");
        return;
      }

      alert("Evento cadastrado com sucesso!");
      navigation.goBack();
    } catch (error) {
      console.error("Erro ao cadastrar evento:", error);
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

      <DatePicker
        label="Datas"
        startDate={dataInicio}
        endDate={dataFim}
        onChangeStartDate={setDataInicio}
        onChangeEndDate={setDataFim}
      />
      <DatePicker
        label="Horários"
        mode="time"
        startDate={horaInicio}
        endDate={horaFim}
        onChangeStartDate={setHoraInicio}
        onChangeEndDate={setHoraFim}
      />

      <SingleChoicePicker
        selected={tema}
        onSelect={setTema}
        options={temas}
      />

      <ImagePickerButton
        cor={colors.primary}
        texto={cartaz ? "Cartaz selecionado" : "Upload cartaz"}
        onPick={setCartaz}
        style={styles.uploadButton}
      />

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
    marginTop: 16,
  },
  erro: {
    color: colors.error,
    textAlign: "center",
    marginTop: 12,
    fontSize: 14,
  },
});
