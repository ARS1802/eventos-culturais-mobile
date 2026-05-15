import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
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
    data = new Date(Number(dataIso[1]), Number(dataIso[2]) - 1, Number(dataIso[3]));
  }

  if (dataBr) {
    data = new Date(Number(dataBr[3]), Number(dataBr[2]) - 1, Number(dataBr[1]));
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

function lerParametro(props, nome, fallback = "") {
  return props[nome] ?? fallback;
}

export function Evento(props) {
  const Titulo = lerParametro(props, "Titulo", props.title);
  const Data = lerParametro(props, "Data", props.date);
  const NomeOrganizador = lerParametro(
    props,
    "NomeOrganizador",
    props.organizerName,
  );
  const Estrelas = lerParametro(props, "Estrelas", props.rating);
  const Comentario =
    props["Comentario"] ?? props["Coment\u00e1rio"] ?? props.comment ?? "";
  const ImgURL = lerParametro(props, "ImgURL", props.imageUrl);

  const estrelas = limitarEstrelas(Estrelas);
  const temComentario = Boolean(String(Comentario).trim());

  return (
    <View style={styles.container}>
      <View style={styles.infoContainer}>
        <View style={styles.posterContainer}>
          {ImgURL ? (
            <Image
              source={{ uri: ImgURL }}
              style={styles.poster}
              resizeMode="cover"
            />
          ) : (
            <Text style={styles.posterPlaceholder}>cartaz principal</Text>
          )}
        </View>

        <View style={styles.textContainer}>
          <Text numberOfLines={1} style={styles.titulo}>
            {Titulo || "Titulo"}
          </Text>
          <Text style={styles.data}>{formatarData(Data)}</Text>
          <Text numberOfLines={1} style={styles.organizador}>
            {NomeOrganizador || "nome do organizador"}
          </Text>
          <Text style={styles.estrelas}>
            {"\u2605".repeat(estrelas)}
            {"\u2606".repeat(5 - estrelas)}
          </Text>
        </View>
      </View>

      {temComentario && (
        <View style={styles.comentarioContainer}>
          <Text style={styles.comentario}>{Comentario}</Text>
        </View>
      )}
    </View>
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
  comentarioContainer: {
    borderTopWidth: 1,
    borderTopColor: "#EFE8DA",
    paddingHorizontal: 18,
    paddingVertical: 18,
    backgroundColor: colors.white,
  },
  comentario: {
    color: colors.text,
    fontSize: 21,
    lineHeight: 25,
  },
});
