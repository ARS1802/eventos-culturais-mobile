import React, { useMemo, useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import colors from "../assets/colors";
import { Header } from "./Header";
import { MainContainer } from "./MainContainer";

function limitarEstrelas(valor) {
  const numero = Number(valor);

  if (Number.isNaN(numero)) {
    return 0;
  }

  return Math.max(0, Math.min(5, Math.round(numero)));
}

function formatarData(valor) {
  if (!valor) {
    return "data";
  }

  const texto = String(valor);
  const dataIso = texto.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  const dataBr = texto.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  let data = valor instanceof Date ? valor : new Date(valor);

  if (dataIso) {
    data = new Date(
      Number(dataIso[1]),
      Number(dataIso[2]) - 1,
      Number(dataIso[3]),
    );
  }

  if (dataBr) {
    data = new Date(
      Number(dataBr[3]),
      Number(dataBr[2]) - 1,
      Number(dataBr[1]),
    );
  }

  if (Number.isNaN(data.getTime())) {
    return String(valor);
  }

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(data);
}

function Estrelas({ valor, tamanho = 24, selecionavel = false, onSelect }) {
  const estrelas = limitarEstrelas(valor);

  return (
    <View style={styles.estrelasLinha}>
      {[1, 2, 3, 4, 5].map((item) => (
        <TouchableOpacity
          key={item}
          disabled={!selecionavel}
          onPress={() => onSelect?.(item)}
          activeOpacity={0.7}
        >
          <Text style={[styles.estrela, { fontSize: tamanho }]}>
            {item <= estrelas ? "\u2605" : "\u2606"}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

export function EventoInfo({ route, navigation }) {
  const evento = useMemo(() => route?.params?.evento ?? null, [route]);
  const podeAvaliar = Boolean(route?.params?.podeAvaliar);
  const avaliacoes = Array.isArray(route?.params?.avaliacoes)
    ? route.params.avaliacoes
    : [];
  const [avaliando, setAvaliando] = useState(false);
  const [nota, setNota] = useState(0);
  const [textoAvaliacao, setTextoAvaliacao] = useState("");

  const categorias = Array.isArray(evento?.themes)
    ? evento.themes
    : String(evento?.themes ?? "")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

  if (!evento) {
    return null;
  }

  return (
    <KeyboardAvoidingView
      style={styles.keyboardAvoiding}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <MainContainer
        top={
          <View style={styles.topContainer}>
            <Header title={evento.title} />
            <TouchableOpacity
              onPress={() => navigation?.goBack?.()}
              style={styles.voltarButton}
            >
              <Text style={styles.voltarText}>{"<"}</Text>
            </TouchableOpacity>
          </View>
        }
        bottom={
          podeAvaliar && !avaliando ? (
            <View style={styles.bottomBar}>
              <TouchableOpacity
                onPress={() => setAvaliando(true)}
                style={styles.avaliarButton}
              >
                <Text style={styles.avaliarText}>Avaliar</Text>
              </TouchableOpacity>
            </View>
          ) : null
        }
      >
        <View style={styles.card}>
          {evento.poster?.url ? (
            <Image
              source={{ uri: evento.poster.url }}
              style={styles.imagem}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.imagemPlaceholder}>
              <Text style={styles.imagemPlaceholderText}>cartaz do evento</Text>
            </View>
          )}

          <Text style={styles.organizador}>by {evento.organizerName}</Text>

          {categorias.length > 0 && (
            <View style={styles.categorias}>
              {categorias.map((categoria) => (
                <Text key={categoria} style={styles.categoria}>
                  {categoria}
                </Text>
              ))}
            </View>
          )}

          <Text style={styles.sinopse}>{evento.description}</Text>

          <View style={styles.infoBloco}>
            <Text style={styles.infoTitulo}>Datas:</Text>
            <Text style={styles.infoTexto}>{formatarData(evento.startAt)}</Text>

            <Text style={styles.infoTitulo}>Endereco:</Text>
            <Text style={styles.infoTexto}>{evento.address}</Text>
          </View>

          <View style={styles.avaliacoesHeader}>
            <Text style={styles.avaliacoesTitulo}>Avaliacoes</Text>
          </View>

          <View style={styles.avaliacoesBox}>
            <Estrelas
              valor={evento.reviewStats?.ratingAverage ?? 0}
              tamanho={18}
            />
            {avaliacoes.length > 0 ? (
              avaliacoes.map((avaliacao, index) => (
                <View key={`${avaliacao.usuario ?? "usuario"}-${index}`}>
                  <Text style={styles.usuarioAvaliacao}>
                    {avaliacao.usuario ?? "visitante"}
                  </Text>
                  <Text style={styles.textoAvaliacao}>
                    {avaliacao.comentario ?? avaliacao.texto}
                  </Text>
                </View>
              ))
            ) : (
              <Text style={styles.textoAvaliacao}>
                Ainda nao ha avaliacoes.
              </Text>
            )}
          </View>

          {podeAvaliar && avaliando && (
            <View style={styles.formAvaliacao}>
              <Estrelas
                valor={nota}
                tamanho={30}
                selecionavel
                onSelect={setNota}
              />
              <TextInput
                value={textoAvaliacao}
                onChangeText={setTextoAvaliacao}
                placeholder="Descreva sua experiencia..."
                multiline
                scrollEnabled
                style={styles.inputAvaliacao}
              />
              <TouchableOpacity style={styles.publicarButton}>
                <Text style={styles.publicarText}>Publicar Avaliacao</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </MainContainer>
    </KeyboardAvoidingView>
  );
}

export default EventoInfo;

const styles = StyleSheet.create({
  keyboardAvoiding: {
    flex: 1,
  },
  topContainer: {
    width: "100%",
  },
  card: {
    width: "100%",
    paddingBottom: 24,
    overflow: "hidden",
    backgroundColor: colors.background,
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
  imagem: {
    width: 170,
    height: 170,
    marginTop: 14,
    alignSelf: "center",
  },
  imagemPlaceholder: {
    width: 170,
    height: 170,
    marginTop: 14,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "#1F1F1F",
    backgroundColor: colors.white,
  },
  imagemPlaceholderText: {
    width: 100,
    color: colors.text,
    fontSize: 18,
    textAlign: "center",
  },
  organizador: {
    marginTop: 8,
    color: "#1F1F1F",
    fontSize: 14,
    fontWeight: "800",
    textAlign: "center",
  },
  categorias: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    paddingHorizontal: 24,
    marginTop: 12,
  },
  categoria: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: "#D0A08E",
    borderRadius: 5,
    color: "#D0A08E",
    fontSize: 12,
    fontWeight: "800",
  },
  sinopse: {
    paddingHorizontal: 24,
    marginTop: 12,
    color: "#1F1F1F",
    fontSize: 15,
    lineHeight: 19,
  },
  infoBloco: {
    paddingHorizontal: 24,
    marginTop: 16,
  },
  infoTitulo: {
    color: "#D0A08E",
    fontSize: 17,
    fontWeight: "900",
    marginTop: 4,
  },
  infoTexto: {
    color: "#1F1F1F",
    fontSize: 13,
    fontWeight: "700",
    marginLeft: 18,
  },
  avaliacoesHeader: {
    marginHorizontal: 24,
    marginTop: 16,
    paddingVertical: 6,
    alignItems: "center",
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    backgroundColor: "#E8D48D",
  },
  avaliacoesTitulo: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "900",
  },
  avaliacoesBox: {
    marginHorizontal: 24,
    padding: 10,
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
    backgroundColor: colors.white,
  },
  estrelasLinha: {
    flexDirection: "row",
    alignItems: "center",
  },
  estrela: {
    color: "#E8D48D",
    lineHeight: 34,
    marginRight: 8,
  },
  usuarioAvaliacao: {
    color: "#B8A8D9",
    fontSize: 11,
    fontWeight: "700",
  },
  textoAvaliacao: {
    color: "#1F1F1F",
    fontSize: 16,
    lineHeight: 22,
    marginTop: 4,
  },
  formAvaliacao: {
    marginHorizontal: 24,
    marginTop: 14,
    paddingBottom: 120,
  },
  inputAvaliacao: {
    minHeight: 142,
    marginTop: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: "#D0A08E",
    borderRadius: 8,
    color: colors.text,
    textAlignVertical: "top",
    backgroundColor: "#F4EBDD",
  },
  publicarButton: {
    minHeight: 44,
    marginTop: 14,
    marginHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 7,
    backgroundColor: "#C9D2B6",
  },
  publicarText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "800",
  },
  bottomBar: {
    width: "100%",
    minHeight: 88,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#D0A08E",
  },
  avaliarButton: {
    minWidth: 150,
    minHeight: 42,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 7,
    backgroundColor: "#E8D48D",
  },
  avaliarText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "800",
  },
});
