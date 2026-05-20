import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import colors from "../assets/colors";

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

export function Evento({
  evento,
  podeAvaliar = false,
  avaliacoes = [],
  onPress,
}) {
  const navigation = useNavigation();

  if (!evento) {
    return null;
  }

  const posterUrl = evento.poster?.url ?? "";
  const estrelas = limitarEstrelas(evento.reviewStats?.ratingAverage ?? 0);

  function abrirDetalhes() {
    if (onPress) {
      onPress(evento);
      return;
    }

    navigation.navigate("EventoInfo", {
      evento,
      avaliacoes,
      podeAvaliar,
    });
  }

  return (
    <TouchableOpacity
      activeOpacity={0.82}
      onPress={abrirDetalhes}
      style={styles.container}
    >
      <View style={styles.infoContainer}>
        <View style={styles.posterContainer}>
          {posterUrl ? (
            <Image
              source={{ uri: posterUrl }}
              style={styles.poster}
              resizeMode="cover"
            />
          ) : (
            <Text style={styles.posterPlaceholder}>cartaz principal</Text>
          )}
        </View>

        <View style={styles.textContainer}>
          <Text numberOfLines={1} style={styles.titulo}>
            {evento.title || "Titulo"}
          </Text>
          <Text style={styles.data}>{formatarData(evento.startAt)}</Text>
          {evento.address ? (
            <Text numberOfLines={1} style={styles.endereco}>
              {evento.address}
            </Text>
          ) : null}
          <Text numberOfLines={1} style={styles.organizador}>
            {evento.organizerName || "nome do organizador"}
          </Text>
          <Text style={styles.estrelas}>
            {"\u2605".repeat(estrelas)}
            {"\u2606".repeat(5 - estrelas)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default Evento;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginTop: 18,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: colors.white,
  },
  infoContainer: {
    minHeight: 126,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    padding: 12,
    backgroundColor: colors.white,
  },
  posterContainer: {
    width: 96,
    height: 96,
    borderWidth: 3,
    borderColor: "#1F1F1F",
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    backgroundColor: colors.white,
  },
  poster: {
    width: "100%",
    height: "100%",
  },
  posterPlaceholder: {
    width: 72,
    color: colors.text,
    fontSize: 17,
    lineHeight: 20,
    textAlign: "center",
  },
  textContainer: {
    flex: 1,
    minWidth: 0,
    justifyContent: "center",
  },
  titulo: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 10,
  },
  data: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: "800",
  },
  endereco: {
    color: colors.text,
    fontSize: 12,
    fontWeight: "600",
    marginTop: 2,
  },
  organizador: {
    color: "#1F1F1F",
    fontSize: 12,
    fontWeight: "700",
    marginTop: 2,
    marginBottom: 4,
  },
  estrelas: {
    color: colors.accent,
    fontSize: 27,
    lineHeight: 30,
  },
});
