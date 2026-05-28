import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import colors from "../assets/colors";

/**
 * @typedef {import("../backend/models/CulturalEvent").CulturalEvent} CulturalEvent
 */

function limitarEstrelas(valor) {
  const numero = Number(valor);

  if (Number.isNaN(numero)) {
    return 0;
  }

  return Math.max(0, Math.min(5, Math.round(numero)));
}

function ehDataValida(valor) {
  if (valor == null) {
    return true;
  }

  if (valor instanceof Date) {
    return !Number.isNaN(valor.getTime());
  }

  if (typeof valor === "string" || typeof valor === "number") {
    return !Number.isNaN(new Date(valor).getTime());
  }

  return false;
}

/**
 * Valida em runtime se o objeto tem a estrutura minima de CulturalEvent.
 * Interfaces TypeScript nao existem no app compilado, entao checamos os campos.
 *
 * @param {unknown} valor
 * @returns {valor is CulturalEvent}
 */
function ehCulturalEvent(valor) {
  if (!valor || typeof valor !== "object") {
    return false;
  }

  return (
    typeof valor.id === "string" &&
    typeof valor.organizerId === "string" &&
    typeof valor.organizerName === "string" &&
    typeof valor.title === "string" &&
    typeof valor.description === "string" &&
    typeof valor.address === "string" &&
    Array.isArray(valor.themes) &&
    ehDataValida(valor.startAt) &&
    typeof valor.status === "string" &&
    valor.reviewStats &&
    typeof valor.reviewStats === "object" &&
    typeof valor.reviewStats.count === "number" &&
    typeof valor.reviewStats.ratingSum === "number" &&
    typeof valor.reviewStats.ratingAverage === "number"
  );
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

function formatarPeriodo(startAt, endAt) {
  const dataInicio = formatarData(startAt);

  if (!endAt) {
    return dataInicio;
  }

  return `${dataInicio} - ${formatarData(endAt)}`;
}

/**
 * Card resumido de evento.
 *
 * @param {Object} props
 * @param {CulturalEvent} props.evento Evento seguindo a interface CulturalEvent.
 * @param {boolean} [props.podeAvaliar]
 * @param {string} [props.comentarioAvaliacao]
 * @param {(evento: CulturalEvent) => void} [props.onPress]
 */
export function Evento({
  evento,
  podeAvaliar = false,
  comentarioAvaliacao = "",
  onPress,
}) {
  const navigation = useNavigation();

  if (!ehCulturalEvent(evento)) {
    console.warn("Evento recebeu um objeto fora da interface CulturalEvent.");
    return null;
  }

  const {
    id,
    organizerId,
    title,
    organizerName,
    address,
    startAt,
    endAt,
    poster,
    reviewStats,
  } = evento;
  const posterUrl = poster?.url ?? "";
  const estrelas = limitarEstrelas(reviewStats?.ratingAverage ?? 0);
  const comentario = comentarioAvaliacao?.trim?.() ?? "";

  function abrirDetalhes() {
    if (onPress) {
      onPress(evento);
      return;
    }

    navigation.navigate("EventoInfo", {
      eventoId: id,
      organizerId,
      evento,
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
            {title || "Titulo"}
          </Text>
          <Text style={styles.data}>{formatarPeriodo(startAt, endAt)}</Text>
          {address ? (
            <Text numberOfLines={1} style={styles.endereco}>
              {address}
            </Text>
          ) : null}
          <Text numberOfLines={1} style={styles.organizador}>
            {organizerName || "nome do organizador"}
          </Text>
          <Text style={styles.estrelas}>
            {"\u2605".repeat(estrelas)}
            {"\u2606".repeat(5 - estrelas)}
          </Text>
        </View>
      </View>

      {comentario ? (
        <View style={styles.comentarioContainer}>
          <Text style={styles.comentarioTexto}>{comentario}</Text>
        </View>
      ) : null}
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
    color: colors.starContrast,
    fontSize: 27,
    lineHeight: 30,
  },
  comentarioContainer: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: colors.background,
    backgroundColor: colors.white,
  },
  comentarioTexto: {
    color: "#1F1F1F",
    fontSize: 16,
    lineHeight: 21,
  },
});
