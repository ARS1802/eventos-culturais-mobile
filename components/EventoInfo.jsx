import React, { useEffect, useMemo, useState } from "react";
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
import { getDocs, query, where } from "firebase/firestore";
import colors from "../assets/colors";
import { getEvent } from "../backend/firebase/services/getEvent";
import { registerReview } from "../backend/firebase/services/registerReview";
import { reviewsCollection } from "../backend/models/firestoreReferences";
import { useAuth } from "../navigation/contexts/AuthContext";
import { Header } from "./Header";
import { MainContainer } from "./MainContainer";

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

function criarData(valor) {
  if (!valor) {
    return null;
  }

  if (typeof valor?.toDate === "function") {
    return valor.toDate();
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

  return data;
}

function formatarData(valor) {
  const data = criarData(valor);

  if (!data) {
    return "data";
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

function formatarHorario(valor) {
  const data = criarData(valor);

  if (!data) {
    return "horario";
  }

  if (Number.isNaN(data.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
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

function mesclarAvaliacoes(atuais, proximas) {
  const porId = new Map();

  [...proximas, ...atuais].forEach((avaliacao, index) => {
    const chave =
      avaliacao.id ??
      `${avaliacao.eventId ?? "event"}-${avaliacao.visitorId ?? "visitor"}-${index}`;

    if (!porId.has(chave)) {
      porId.set(chave, avaliacao);
    }
  });

  return Array.from(porId.values());
}

/**
 * Tela detalhada de evento.
 *
 * @param {Object} props
 * @param {{ params?: { eventoId?: string, organizerId?: string, evento?: CulturalEvent, podeAvaliar?: boolean, avaliacoes?: Array } }} [props.route]
 * @param {{ goBack?: () => void }} [props.navigation]
 */
export function EventoInfo({ route, navigation }) {
  const { usuario } = useAuth();
  /** @type {CulturalEvent | null} */
  const eventoParam = useMemo(() => route?.params?.evento ?? null, [route]);
  const [evento, setEvento] = useState(eventoParam);
  const eventoId = route?.params?.eventoId ?? evento?.id ?? "";
  const organizerId = route?.params?.organizerId ?? evento?.organizerId ?? "";
  const podeAvaliar = Boolean(route?.params?.podeAvaliar);
  const [avaliacoes, setAvaliacoes] = useState(
    Array.isArray(route?.params?.avaliacoes) ? route.params.avaliacoes : [],
  );
  const [carregandoEvento, setCarregandoEvento] = useState(!eventoParam);
  const [erroEvento, setErroEvento] = useState("");
  const [avaliando, setAvaliando] = useState(false);
  const [publicandoAvaliacao, setPublicandoAvaliacao] = useState(false);
  const [nota, setNota] = useState(0);
  const [textoAvaliacao, setTextoAvaliacao] = useState("");

  useEffect(() => {
    setEvento(eventoParam);
  }, [eventoParam]);

  useEffect(() => {
    setAvaliacoes(
      Array.isArray(route?.params?.avaliacoes) ? route.params.avaliacoes : [],
    );
  }, [route]);

  useEffect(() => {
    let isMounted = true;

    async function carregarEvento() {
      if (eventoParam || !eventoId) {
        setCarregandoEvento(false);
        return;
      }

      try {
        setCarregandoEvento(true);
        setErroEvento("");

        const eventoEncontrado = await getEvent({ eventoId });

        if (!isMounted) {
          return;
        }

        if (!eventoEncontrado) {
          setErroEvento("Evento não encontrado.");
          setEvento(null);
          return;
        }

        setEvento(eventoEncontrado);
      } catch (error) {
        console.error("Erro ao carregar evento:", error);

        if (isMounted) {
          setErroEvento("Não foi possível carregar o evento.");
        }
      } finally {
        if (isMounted) {
          setCarregandoEvento(false);
        }
      }
    }

    carregarEvento();

    return () => {
      isMounted = false;
    };
  }, [eventoId, eventoParam]);

  useEffect(() => {
    let isMounted = true;

    async function carregarAvaliacoesDoEvento() {
      if (!eventoId) {
        return;
      }

      try {
        const reviewsQuery = query(
          reviewsCollection,
          where("eventId", "==", eventoId),
        );
        const querySnapshot = await getDocs(reviewsQuery);
        const avaliacoesDoEvento = querySnapshot.docs.map((docSnapshot) =>
          docSnapshot.data(),
        );

        if (!isMounted) {
          return;
        }

        setAvaliacoes(avaliacoesDoEvento);
      } catch (error) {
        console.error("Erro ao carregar avaliações do evento:", error);
      }
    }

    carregarAvaliacoesDoEvento();

    return () => {
      isMounted = false;
    };
  }, [eventoId]);

  async function publicarAvaliacao() {
    if (!evento) {
      return;
    }

    if (!usuario?.id) {
      alert("Faça login para avaliar o evento.");
      return;
    }

    if (nota < 1) {
      alert("Selecione uma nota de 1 a 5.");
      return;
    }

    setPublicandoAvaliacao(true);

    try {
      const comentario = textoAvaliacao.trim();
      const visitorName = usuario.name?.trim?.() || "Visitante";
      const reviewId = await registerReview({
        eventId: evento.id,
        visitorId: usuario.id,
        organizerId: organizerId || evento.organizerId,
        rating: nota,
        comment: comentario,
        visitorName,
      });

      if (reviewId === "FIRESTORE_ERROR") {
        alert("Não foi possível publicar a avaliação.");
        return;
      }

      const avaliacaoPublicada = {
        id: reviewId,
        eventId: evento.id,
        visitorId: usuario.id,
        organizerId: organizerId || evento.organizerId,
        rating: nota,
        comment: comentario,
        visitorName,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const statsAtuais = evento.reviewStats ?? {
        count: 0,
        ratingSum: 0,
        ratingAverage: 0,
      };
      const proximoCount = statsAtuais.count + 1;
      const proximoRatingSum = statsAtuais.ratingSum + nota;

      setAvaliacoes((atuais) =>
        mesclarAvaliacoes(atuais, [avaliacaoPublicada]),
      );
      setEvento({
        ...evento,
        reviewStats: {
          count: proximoCount,
          ratingSum: proximoRatingSum,
          ratingAverage: proximoRatingSum / proximoCount,
        },
      });
      setNota(0);
      setTextoAvaliacao("");
      setAvaliando(false);
      alert("Avaliação publicada com sucesso.");
    } catch (error) {
      console.error("Erro ao publicar avaliação:", error);
      alert("Não foi possível publicar a avaliação.");
    } finally {
      setPublicandoAvaliacao(false);
    }
  }

  const categorias = Array.isArray(evento?.themes)
    ? evento.themes
    : String(evento?.themes ?? "")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

  if (carregandoEvento) {
    return (
      <MainContainer top={<Header title="Evento" />}>
        <View style={styles.statusContainer}>
          <Text style={styles.statusText}>Carregando evento...</Text>
        </View>
      </MainContainer>
    );
  }

  if (!evento || erroEvento) {
    return (
      <MainContainer top={<Header title="Evento" />}>
        <View style={styles.statusContainer}>
          <Text style={styles.statusText}>
            {erroEvento || "Evento não encontrado."}
          </Text>
        </View>
      </MainContainer>
    );
  }

  const {
    title,
    organizerName,
    description,
    address,
    startAt,
    endAt,
    poster,
    reviewStats,
  } = evento;
  const usuarioEhOrganizador = usuario?.role === "organizer";
  const podeAvaliarEvento = podeAvaliar && !usuarioEhOrganizador;

  return (
    <KeyboardAvoidingView
      style={styles.keyboardAvoiding}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <MainContainer
        top={
          <View style={styles.topContainer}>
            <Header title={title} />
            <TouchableOpacity
              onPress={() => navigation?.goBack?.()}
              style={styles.voltarButton}
            >
              <Text style={styles.voltarText}>{"<"}</Text>
            </TouchableOpacity>
          </View>
        }
        bottom={
          podeAvaliarEvento && !avaliando ? (
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
          {poster?.url ? (
            <Image
              source={{ uri: poster.url }}
              style={styles.imagem}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.imagemPlaceholder}>
              <Text style={styles.imagemPlaceholderText}>cartaz do evento</Text>
            </View>
          )}

          <Text style={styles.organizador}>by {organizerName}</Text>

          {categorias.length > 0 && (
            <View style={styles.categorias}>
              {categorias.map((categoria) => (
                <Text key={categoria} style={styles.categoria}>
                  {categoria}
                </Text>
              ))}
            </View>
          )}

          <Text style={styles.sinopse}>{description}</Text>

          <View style={styles.infoBloco}>
            <Text style={styles.infoTitulo}>Datas:</Text>
            <Text style={styles.infoTexto}>
              Início: {formatarData(startAt)} às {formatarHorario(startAt)}
              {"\n"}
              Fim:{" "}
              {endAt
                ? `${formatarData(endAt)} às ${formatarHorario(endAt)}`
                : "Não informado"}
            </Text>

            <Text style={styles.infoTitulo}>Endereço:</Text>
            <Text style={styles.infoTexto}>{address}</Text>
          </View>

          <View style={styles.avaliacoesHeader}>
            <Text style={styles.avaliacoesTitulo}>Avaliações</Text>
          </View>

          <View style={styles.avaliacoesBox}>
            <Estrelas valor={reviewStats?.ratingAverage ?? 0} tamanho={18} />
            {avaliacoes.length > 0 ? (
              avaliacoes.map((avaliacao, index) => (
                <View
                  key={
                    avaliacao.id ??
                    `${avaliacao.visitorId ?? "usuario"}-${index}`
                  }
                >
                  <Text style={styles.usuarioAvaliacao}>
                    {avaliacao.visitorName ?? avaliacao.usuario ?? "visitante"}
                  </Text>
                  <Text style={styles.textoAvaliacao}>
                    {avaliacao.comment ??
                      avaliacao.comentario ??
                      avaliacao.texto}
                  </Text>
                </View>
              ))
            ) : (
              <Text style={styles.textoAvaliacao}>
                Ainda não há avaliações.
              </Text>
            )}
          </View>

          {podeAvaliarEvento && avaliando && (
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
                placeholder="Descreva sua experiência..."
                multiline
                scrollEnabled
                style={styles.inputAvaliacao}
              />
              <TouchableOpacity
                disabled={publicandoAvaliacao}
                onPress={publicarAvaliacao}
                style={[
                  styles.publicarButton,
                  publicandoAvaliacao && styles.buttonDisabled,
                ]}
              >
                <Text style={styles.publicarText}>
                  {publicandoAvaliacao ? "Publicando..." : "Publicar avaliação"}
                </Text>
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
  statusContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 28,
  },
  statusText: {
    color: colors.text,
    fontSize: 14,
    textAlign: "center",
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
  buttonDisabled: {
    opacity: 0.6,
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
