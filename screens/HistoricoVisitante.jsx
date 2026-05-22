import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import colors from "../assets/colors";
import { Evento, Header, MainContainer } from "../components";
import { getEvent } from "../backend/firebase/services/getEvent";
import { getReviewsByVisitor } from "../backend/firebase/services/getReview";
import { useAuth } from "../navigation/contexts/AuthContext";
import { FeedStatus } from "../utils/feed";

function getDateTime(value) {
  if (!value) {
    return 0;
  }

  const date = typeof value?.toDate === "function" ? value.toDate() : value;
  const time = new Date(date).getTime();

  return Number.isFinite(time) ? time : 0;
}

function getLatestReviewsByEvent(reviews) {
  if (!Array.isArray(reviews)) {
    return [];
  }

  const reviewsByDate = reviews
    .filter((review) => review?.eventId)
    .sort(
      (first, second) =>
        getDateTime(second.createdAt) - getDateTime(first.createdAt),
    );
  const reviewsByEvent = new Map();

  reviewsByDate.forEach((review) => {
    if (!reviewsByEvent.has(review.eventId)) {
      reviewsByEvent.set(review.eventId, review);
    }
  });

  return Array.from(reviewsByEvent.values());
}

function getReviewComment(review) {
  return review?.comment?.trim?.() || "Sem comentário.";
}

export function HistoricoVisitante({ navigation }) {
  const { firebaseUser, usuario, loading } = useAuth();
  const isMountedRef = useRef(true);
  const isAuthenticated = Boolean(firebaseUser);
  const isVisitor = usuario?.role === "visitor";
  const visitorId = usuario?.id ?? firebaseUser?.uid ?? null;
  const canLoadHistory =
    isAuthenticated && (!usuario || isVisitor) && Boolean(visitorId);
  const [historyItems, setHistoryItems] = useState([]);
  const [initialLoading, setInitialLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  function voltar() {
    if (navigation.canGoBack?.()) {
      navigation.goBack();
      return;
    }

    navigation.navigate("FeedVisitante");
  }

  const loadHistory = useCallback(
    async ({ refresh = false } = {}) => {
      if (!canLoadHistory || !visitorId) {
        setHistoryItems([]);
        setInitialLoading(false);
        setRefreshing(false);
        return;
      }

      if (refresh) {
        setRefreshing(true);
      } else {
        setInitialLoading(true);
      }

      setError("");

      try {
        const reviews = await getReviewsByVisitor(visitorId);
        const latestReviews = getLatestReviewsByEvent(reviews);

        const items = await Promise.all(
          latestReviews.map(async (review) => {
            const event = await getEvent({ eventoId: review.eventId });

            if (!event) {
              return null;
            }

            return {
              event,
              review,
            };
          }),
        );

        if (isMountedRef.current) {
          setHistoryItems(items.filter(Boolean));
        }
      } catch (historyError) {
        console.error("Erro ao carregar histórico do visitante:", historyError);

        if (isMountedRef.current) {
          setError("Não foi possível carregar seu histórico de avaliações.");
        }
      } finally {
        if (isMountedRef.current) {
          setInitialLoading(false);
          setRefreshing(false);
        }
      }
    },
    [canLoadHistory, visitorId],
  );

  useEffect(() => {
    if (loading) {
      return;
    }

    loadHistory();
  }, [loading, loadHistory]);

  function renderContent() {
    if (loading) {
      return <FeedStatus>Verificando login...</FeedStatus>;
    }

    if (!isAuthenticated) {
      return <FeedStatus>Faça login para ver seu histórico.</FeedStatus>;
    }

    if (usuario && !isVisitor) {
      return (
        <FeedStatus>Este histórico é exclusivo para visitantes.</FeedStatus>
      );
    }

    if (initialLoading) {
      return (
        <View style={styles.statusContainer}>
          <ActivityIndicator color={colors.primary} />
          <Text style={styles.statusText}>Carregando histórico...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.statusContainer}>
          <Text style={styles.statusText}>{error}</Text>
          <TouchableOpacity
            onPress={() => loadHistory()}
            style={styles.retryButton}
          >
            <Text style={styles.retryText}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (historyItems.length === 0) {
      return <FeedStatus>Nenhuma avaliação encontrada.</FeedStatus>;
    }

    return (
      <>
        {historyItems.map((item) => (
          <Evento
            key={item.review.id ?? item.event.id}
            evento={item.event}
            comentarioAvaliacao={getReviewComment(item.review)}
          />
        ))}
      </>
    );
  }

  return (
    <MainContainer
      top={
        <View style={styles.topContainer}>
          <Header title="Histórico de avaliações" />
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
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => loadHistory({ refresh: true })}
          colors={[colors.primary]}
          tintColor={colors.primary}
        />
      }
      contentContainerStyle={styles.content}
    >
      {renderContent()}
    </MainContainer>
  );
}

export default HistoricoVisitante;

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
    paddingTop: 20,
    paddingBottom: 24,
  },
  statusContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 28,
    gap: 10,
  },
  statusText: {
    color: colors.text,
    fontSize: 14,
    textAlign: "center",
  },
  retryButton: {
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: colors.primary,
  },
  retryText: {
    color: colors.white,
    fontWeight: "700",
  },
});
