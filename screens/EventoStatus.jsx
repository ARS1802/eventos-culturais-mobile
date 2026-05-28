import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { deleteObject, ref } from "firebase/storage";

import colors from "../assets/colors";
import { deleteEvent } from "../backend/firebase/services/deleteEvent";
import { getEvent } from "../backend/firebase/services/getEvent";
import { getReviewsByEvent } from "../backend/firebase/services/getReview";
import { storage } from "../backend/firebase/firebaseConfig";
import { Header, MainContainer } from "../components";
import { useAuth } from "../navigation/contexts/AuthContext";
import { ConfirmDeletion } from "../popUps/ConfirmDeletion";

const MS_POR_DIA = 24 * 60 * 60 * 1000;
const CHART_ALTURA = 142;
const CHART_TOPO = 8;
const CHART_LABEL_ALTURA = 34;
const CHART_ITEM_LARGURA = 52;
const CHART_BARRA_LARGURA = 18;

function criarData(valor) {
  if (!valor) {
    return null;
  }

  if (typeof valor?.toDate === "function") {
    return valor.toDate();
  }

  if (typeof valor?.seconds === "number") {
    return new Date(valor.seconds * 1000);
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

  return Number.isNaN(data.getTime()) ? null : data;
}

function inicioDoDia(data) {
  return new Date(data.getFullYear(), data.getMonth(), data.getDate());
}

function limitarNota(valor) {
  const nota = Number(valor);

  if (!Number.isFinite(nota)) {
    return 0;
  }

  return Math.max(0, Math.min(5, nota));
}

function normalizarEstrela(valor) {
  const nota = limitarNota(valor);

  if (nota <= 0) {
    return null;
  }

  return Math.max(1, Math.min(5, Math.round(nota)));
}

function calcularDuracaoDias(evento) {
  const inicio = criarData(evento?.startAt);

  if (!inicio) {
    return 0;
  }

  const fimInformado = criarData(evento?.endAt);
  const fim = fimInformado ?? new Date();
  const inicioNormalizado = inicioDoDia(inicio);
  const fimNormalizado = inicioDoDia(fim < inicio ? inicio : fim);

  return Math.max(
    1,
    Math.floor(
      (fimNormalizado.getTime() - inicioNormalizado.getTime()) / MS_POR_DIA,
    ) + 1,
  );
}

function formatarDuracao(dias) {
  if (!dias) {
    return "Não informada";
  }

  return `${dias} ${dias === 1 ? "dia" : "dias"}.`;
}

function contarAvaliacoesPorEstrela(avaliacoes) {
  const contagem = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  };

  avaliacoes.forEach((avaliacao) => {
    const estrela = normalizarEstrela(avaliacao.rating ?? avaliacao.nota);

    if (estrela) {
      contagem[estrela] += 1;
    }
  });

  return [5, 4, 3, 2, 1].map((estrela) => ({
    estrela,
    total: contagem[estrela],
  }));
}

function criarSerieDesempenho(avaliacoes, evento, duracaoDias) {
  const inicio = criarData(evento?.startAt) ?? new Date();
  const inicioNormalizado = inicioDoDia(inicio);
  const buckets = new Map();

  avaliacoes.forEach((avaliacao) => {
    const nota = limitarNota(avaliacao.rating ?? avaliacao.nota);

    if (nota <= 0) {
      return;
    }

    const dataAvaliacao =
      criarData(avaliacao.createdAt) ??
      criarData(avaliacao.updatedAt) ??
      inicio;
    const dia = Math.max(
      1,
      Math.floor(
        (inicioDoDia(dataAvaliacao).getTime() - inicioNormalizado.getTime()) /
          MS_POR_DIA,
      ) + 1,
    );
    const bucket = buckets.get(dia) ?? { soma: 0, total: 0 };

    bucket.soma += nota;
    bucket.total += 1;
    buckets.set(dia, bucket);
  });

  const maiorDiaComAvaliacao = Math.max(0, ...Array.from(buckets.keys()));
  const totalDias = Math.max(1, duracaoDias, maiorDiaComAvaliacao);

  return Array.from({ length: totalDias }, (_, index) => {
    const dia = index + 1;
    const bucket = buckets.get(dia);

    return {
      dia,
      media: bucket ? bucket.soma / bucket.total : null,
      total: bucket?.total ?? 0,
    };
  });
}

function obterAlvoPoster(poster) {
  if (poster?.path) {
    return poster.path;
  }

  if (poster?.fullPath) {
    return poster.fullPath;
  }

  return poster?.url ?? "";
}

async function deletarPosterDoStorage(poster) {
  const alvo = obterAlvoPoster(poster);

  if (!alvo) {
    return;
  }

  try {
    await deleteObject(ref(storage, alvo));
  } catch (error) {
    if (
      error?.code === "storage/object-not-found" ||
      error?.code === "storage/invalid-url" ||
      error?.code === "storage/invalid-argument"
    ) {
      console.warn("Cartaz já removido ou referência inválida:", error?.code);
      return;
    }

    throw error;
  }
}

function LinhaEstrelas({ estrela, total }) {
  return (
    <View style={styles.starRow}>
      <Text style={styles.starText}>{"\u2605".repeat(estrela)}</Text>
      <Text style={styles.starCount}>({total})</Text>
    </View>
  );
}

function DistribuicaoEstrelas({ avaliacoes }) {
  const contagem = useMemo(
    () => contarAvaliacoesPorEstrela(avaliacoes),
    [avaliacoes],
  );

  return (
    <View style={styles.starsCard}>
      {contagem.map((item) => (
        <LinhaEstrelas
          key={item.estrela}
          estrela={item.estrela}
          total={item.total}
        />
      ))}
    </View>
  );
}

function SegmentoLinha({ de, para }) {
  const deltaX = para.x - de.x;
  const deltaY = para.y - de.y;
  const comprimento = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
  const angulo = Math.atan2(deltaY, deltaX);

  return (
    <View
      style={[
        styles.chartLineSegment,
        {
          left: (de.x + para.x) / 2 - comprimento / 2,
          top: (de.y + para.y) / 2,
          width: comprimento,
          transform: [{ rotateZ: `${angulo}rad` }],
        },
      ]}
    />
  );
}

function GraficoDesempenho({ serie }) {
  const larguraGrafico = Math.max(260, serie.length * CHART_ITEM_LARGURA);
  const chartBase = CHART_TOPO + CHART_ALTURA;

  function posicaoY(media) {
    const nota = Math.max(1, Math.min(5, Number(media)));

    return CHART_TOPO + ((5 - nota) / 4) * CHART_ALTURA;
  }

  const pontos = serie
    .map((item, index) => {
      if (item.media == null) {
        return null;
      }

      return {
        dia: item.dia,
        media: item.media,
        x: index * CHART_ITEM_LARGURA + CHART_ITEM_LARGURA / 2,
        y: posicaoY(item.media),
      };
    })
    .filter(Boolean);
  const temAvaliacoes = pontos.length > 0;

  return (
    <View style={styles.chartCard}>
      <View style={styles.chartHeader}>
        <Text style={styles.chartTitle}>Desempenho</Text>
        <Text style={styles.chartSubtitle}>Tempo (dias) x nota média</Text>
      </View>

      <View style={styles.chartContent}>
        <View style={styles.yAxis}>
          {[5, 4, 3, 2, 1].map((nota) => (
            <Text key={nota} style={styles.axisLabel}>
              {nota}
            </Text>
          ))}
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View
            style={[
              styles.chartCanvas,
              {
                width: larguraGrafico,
                height: CHART_TOPO + CHART_ALTURA + CHART_LABEL_ALTURA,
              },
            ]}
          >
            {[5, 4, 3, 2, 1].map((nota) => (
              <View
                key={nota}
                style={[
                  styles.gridLine,
                  {
                    top: posicaoY(nota),
                    width: larguraGrafico,
                  },
                ]}
              />
            ))}

            {serie.map((item, index) => {
              const centroX =
                index * CHART_ITEM_LARGURA + CHART_ITEM_LARGURA / 2;

              if (item.media == null) {
                return (
                  <View
                    key={`bar-${item.dia}`}
                    style={[
                      styles.emptyBar,
                      {
                        left: centroX - CHART_BARRA_LARGURA / 2,
                        top: chartBase - 4,
                      },
                    ]}
                  />
                );
              }

              const top = posicaoY(item.media);

              return (
                <View
                  key={`bar-${item.dia}`}
                  style={[
                    styles.chartBar,
                    {
                      left: centroX - CHART_BARRA_LARGURA / 2,
                      top,
                      height: chartBase - top,
                    },
                  ]}
                />
              );
            })}

            {pontos.slice(1).map((ponto, index) => (
              <SegmentoLinha
                key={`line-${ponto.dia}`}
                de={pontos[index]}
                para={ponto}
              />
            ))}

            {pontos.map((ponto) => (
              <View
                key={`point-${ponto.dia}`}
                style={[
                  styles.chartPoint,
                  {
                    left: ponto.x - 5,
                    top: ponto.y - 5,
                  },
                ]}
              />
            ))}

            {serie.map((item, index) => (
              <Text
                key={`label-${item.dia}`}
                style={[
                  styles.xAxisLabel,
                  {
                    left: index * CHART_ITEM_LARGURA,
                    top: chartBase + 8,
                    width: CHART_ITEM_LARGURA,
                  },
                ]}
              >
                D{item.dia}
              </Text>
            ))}

            {!temAvaliacoes ? (
              <Text style={styles.emptyChartText}>
                Sem avaliações para o gráfico.
              </Text>
            ) : null}
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

export function EventoStatus({ route, navigation }) {
  const { firebaseUser, usuario, loading: authLoading } = useAuth();
  const eventoParam = useMemo(() => route?.params?.evento ?? null, [route]);
  const [evento, setEvento] = useState(eventoParam);
  const eventoId = route?.params?.eventoId ?? evento?.id ?? "";
  const [avaliacoes, setAvaliacoes] = useState(
    Array.isArray(route?.params?.avaliacoes) ? route.params.avaliacoes : [],
  );
  const [carregandoEvento, setCarregandoEvento] = useState(!eventoParam);
  const [carregandoAvaliacoes, setCarregandoAvaliacoes] = useState(true);
  const [erro, setErro] = useState("");
  const [deletando, setDeletando] = useState(false);
  const [confirmacaoVisivel, setConfirmacaoVisivel] = useState(false);

  useEffect(() => {
    setEvento(eventoParam);
  }, [eventoParam]);

  useEffect(() => {
    let isMounted = true;

    async function carregarEvento() {
      if (eventoParam || !eventoId) {
        setCarregandoEvento(false);
        return;
      }

      try {
        setCarregandoEvento(true);
        setErro("");

        const eventoEncontrado = await getEvent({ eventoId });

        if (!isMounted) {
          return;
        }

        if (!eventoEncontrado) {
          setErro("Evento não encontrado.");
          setEvento(null);
          return;
        }

        setEvento(eventoEncontrado);
      } catch (error) {
        console.error("Erro ao carregar status do evento:", error);

        if (isMounted) {
          setErro("Não foi possível carregar o status do evento.");
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

    async function carregarAvaliacoes() {
      if (!eventoId) {
        setCarregandoAvaliacoes(false);
        return;
      }

      try {
        setCarregandoAvaliacoes(true);

        const avaliacoesDoEvento = await getReviewsByEvent(eventoId);

        if (isMounted) {
          setAvaliacoes(avaliacoesDoEvento);
        }
      } catch (error) {
        console.error("Erro ao carregar avaliações do status:", error);

        if (isMounted) {
          alert(
            "Avaliações",
            "Não foi possível carregar as avaliações deste evento.",
          );
        }
      } finally {
        if (isMounted) {
          setCarregandoAvaliacoes(false);
        }
      }
    }

    carregarAvaliacoes();

    return () => {
      isMounted = false;
    };
  }, [eventoId]);

  const usuarioId = usuario?.id ?? firebaseUser?.uid ?? "";
  const podeGerenciar =
    usuario?.role === "organizer" && evento?.organizerId === usuarioId;
  const duracaoDias = useMemo(() => calcularDuracaoDias(evento), [evento]);
  const serieDesempenho = useMemo(
    () => criarSerieDesempenho(avaliacoes, evento, duracaoDias),
    [avaliacoes, duracaoDias, evento],
  );
  const totalAvaliacoes = carregandoAvaliacoes
    ? (evento?.reviewStats?.count ?? avaliacoes.length)
    : avaliacoes.length;

  function voltar() {
    if (navigation?.canGoBack?.()) {
      navigation.goBack();
      return;
    }

    navigation?.navigate?.("FeedOrganizador");
  }

  async function excluirEvento() {
    if (!evento?.id || deletando) {
      return;
    }

    setDeletando(true);
    setConfirmacaoVisivel(false);

    try {
      const poster = evento.poster;
      const resultado = await deleteEvent(evento.id);

      if (resultado === "EVENT_NOT_FOUND") {
        alert("Evento", "Este evento não foi encontrado no Firestore.");
        return;
      }

      await deletarPosterDoStorage(poster);

      if (navigation?.reset) {
        navigation.reset({
          index: 0,
          routes: [{ name: "FeedOrganizador" }],
        });
        return;
      }

      navigation?.navigate?.("FeedOrganizador");
    } catch (error) {
      console.error("Erro ao excluir evento:" + error);
      alert("Excluir evento " + "Não foi possível excluir este evento.");
    } finally {
      setDeletando(false);
    }
  }

  function confirmarExclusao() {
    if (!podeGerenciar) {
      alert(
        "Permissão",
        "Apenas o organizador criador do evento pode excluí-lo.",
      );
      return;
    }

    setConfirmacaoVisivel(true);
  }

  if (carregandoEvento || authLoading) {
    return (
      <MainContainer top={<Header title="Status" />}>
        <View style={styles.statusContainer}>
          <ActivityIndicator color={colors.primary} />
          <Text style={styles.statusText}>Carregando status...</Text>
        </View>
      </MainContainer>
    );
  }

  if (!evento || erro) {
    return (
      <MainContainer
        top={
          <View style={styles.topContainer}>
            <Header title="Status" />
            <TouchableOpacity onPress={voltar} style={styles.voltarButton}>
              <Text style={styles.voltarText}>{"<"}</Text>
            </TouchableOpacity>
          </View>
        }
      >
        <View style={styles.statusContainer}>
          <Text style={styles.statusText}>
            {erro || "Evento não encontrado."}
          </Text>
        </View>
      </MainContainer>
    );
  }

  return (
    <MainContainer
      top={
        <View style={styles.topContainer}>
          <Header title="Status" />
          <TouchableOpacity
            accessibilityLabel="Voltar"
            accessibilityRole="button"
            onPress={voltar}
            style={styles.voltarButton}
          >
            <Text style={styles.voltarText}>{"<"}</Text>
          </TouchableOpacity>
        </View>
      }
      bottom={
        podeGerenciar ? (
          <View style={styles.bottomBar}>
            <TouchableOpacity
              accessibilityLabel="Excluir Evento"
              accessibilityRole="button"
              activeOpacity={0.82}
              disabled={deletando}
              onPress={confirmarExclusao}
              style={[
                styles.deleteButton,
                deletando && styles.deleteButtonDisabled,
              ]}
            >
              <Text style={styles.deleteButtonText}>
                {deletando ? "Excluindo..." : "Excluir Evento"}
              </Text>
            </TouchableOpacity>
          </View>
        ) : null
      }
      contentContainerStyle={styles.content}
    >
      <View style={styles.screenBody}>
        {evento.poster?.url ? (
          <Image
            source={{ uri: evento.poster.url }}
            style={styles.poster}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.posterPlaceholder}>
            <Text style={styles.posterPlaceholderText}>cartaz do evento</Text>
          </View>
        )}

        <Text style={styles.title}>{evento.title}</Text>

        <DistribuicaoEstrelas avaliacoes={avaliacoes} />

        {carregandoAvaliacoes ? (
          <View style={styles.loadingReviews}>
            <ActivityIndicator color={colors.primary} size="small" />
            <Text style={styles.loadingReviewsText}>
              Atualizando métricas...
            </Text>
          </View>
        ) : null}

        <View style={styles.metricGroup}>
          <Text style={styles.metricText}>
            Total de Avaliações:{" "}
            <Text style={styles.metricValue}>{totalAvaliacoes}</Text>
          </Text>
          <Text style={styles.metricText}>
            Duração do evento:{" "}
            <Text style={styles.metricValue}>
              {formatarDuracao(duracaoDias)}
            </Text>
          </Text>
        </View>

        <GraficoDesempenho serie={serieDesempenho} />

        {!podeGerenciar ? (
          <Text style={styles.permissionText}>
            Apenas o organizador criador deste evento pode excluir ou gerenciar
            seu status.
          </Text>
        ) : null}
      </View>

      <ConfirmDeletion
        visible={confirmacaoVisivel}
        loading={deletando}
        onCancel={() => setConfirmacaoVisivel(false)}
        onConfirm={excluirEvento}
      />
    </MainContainer>
  );
}

export default EventoStatus;

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
  content: {
    paddingBottom: 118,
  },
  screenBody: {
    width: "100%",
    alignItems: "center",
    paddingTop: 14,
    paddingBottom: 24,
    gap: 12,
  },
  statusContainer: {
    width: "100%",
    minHeight: 220,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  statusText: {
    color: colors.text,
    fontSize: 15,
    textAlign: "center",
  },
  poster: {
    width: 170,
    height: 170,
    backgroundColor: colors.white,
  },
  posterPlaceholder: {
    width: 170,
    height: 170,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "#1F1F1F",
    backgroundColor: colors.white,
  },
  posterPlaceholderText: {
    width: 108,
    color: colors.text,
    fontSize: 18,
    lineHeight: 22,
    textAlign: "center",
  },
  title: {
    width: "100%",
    paddingHorizontal: 6,
    color: "#1F1F1F",
    fontSize: 16,
    fontWeight: "900",
    lineHeight: 21,
    textAlign: "center",
  },
  starsCard: {
    width: "100%",
    maxWidth: 340,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: colors.white,
  },
  starRow: {
    minHeight: 24,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  starText: {
    minWidth: 116,
    color: colors.starContrast,
    fontSize: 24,
    lineHeight: 27,
    letterSpacing: 0,
  },
  starCount: {
    color: "#1F1F1F",
    fontSize: 12,
    fontWeight: "600",
    fontVariant: ["tabular-nums"],
  },
  loadingReviews: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  loadingReviewsText: {
    color: colors.text,
    fontSize: 12,
    fontWeight: "700",
  },
  metricGroup: {
    width: "100%",
    maxWidth: 340,
    gap: 8,
  },
  metricText: {
    color: "#D0A08E",
    fontSize: 14,
    fontWeight: "900",
  },
  metricValue: {
    color: "#1F1F1F",
    fontWeight: "900",
  },
  chartCard: {
    width: "100%",
    maxWidth: 360,
    padding: 12,
    borderRadius: 8,
    backgroundColor: colors.white,
    gap: 10,
  },
  chartHeader: {
    gap: 2,
  },
  chartTitle: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: "900",
  },
  chartSubtitle: {
    color: colors.text,
    fontSize: 12,
    fontWeight: "700",
  },
  chartContent: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  yAxis: {
    width: 22,
    height: CHART_ALTURA + 2,
    marginTop: CHART_TOPO - 1,
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  axisLabel: {
    color: colors.text,
    fontSize: 10,
    fontWeight: "700",
    fontVariant: ["tabular-nums"],
  },
  chartCanvas: {
    position: "relative",
  },
  gridLine: {
    position: "absolute",
    left: 0,
    height: 1,
    backgroundColor: "#EFE8D6",
  },
  chartBar: {
    position: "absolute",
    width: CHART_BARRA_LARGURA,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    backgroundColor: colors.green,
  },
  emptyBar: {
    position: "absolute",
    width: CHART_BARRA_LARGURA,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#EFE8D6",
  },
  chartLineSegment: {
    position: "absolute",
    height: 2,
    borderRadius: 1,
    backgroundColor: colors.primary,
  },
  chartPoint: {
    position: "absolute",
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: colors.white,
    backgroundColor: colors.primary,
  },
  xAxisLabel: {
    position: "absolute",
    color: colors.text,
    fontSize: 10,
    fontWeight: "800",
    textAlign: "center",
    fontVariant: ["tabular-nums"],
  },
  emptyChartText: {
    position: "absolute",
    left: 0,
    right: 0,
    top: CHART_TOPO + CHART_ALTURA / 2 - 10,
    color: colors.text,
    fontSize: 12,
    fontWeight: "700",
    textAlign: "center",
  },
  permissionText: {
    maxWidth: 340,
    color: colors.text,
    fontSize: 13,
    lineHeight: 18,
    textAlign: "center",
  },
  bottomBar: {
    width: "100%",
    minHeight: 86,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#D0A08E",
  },
  deleteButton: {
    width: "80%",
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 7,
    paddingHorizontal: 18,
    backgroundColor: colors.error,
  },
  deleteButtonDisabled: {
    opacity: 0.6,
  },
  deleteButtonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "800",
  },
});
