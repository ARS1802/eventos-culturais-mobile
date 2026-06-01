import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import colors from "../assets/colors";
import { Evento } from "../components";
import {
  DEFAULT_EVENTS_PAGE_SIZE,
  getEventsPage,
} from "../backend/firebase/services/getEventsPage";
import { normalizeThemeSelection } from "./eventThemes";

function getDateKey(value) {
  if (!value) {
    return "";
  }

  const time = new Date(value).getTime();

  return Number.isFinite(time) ? time : "";
}

export function getEventFeedErrorMessage(error) {
  const message = String(error?.message ?? "").toLowerCase();

  if (
    error?.code === "failed-precondition" &&
    message.includes("requires an index")
  ) {
    return "O Firestore precisa de um índice para essa combinação de filtro e ordenação. Crie o índice indicado no console e tente novamente quando ele ficar pronto.";
  }

  return "Não foi possível carregar os eventos.";
}

export function useEventFeed({
  organizerId = null,
  status = null,
  enabled = true,
  orderByField = "startAt",
  themeFilters = [],
  startDate = null,
  endDate = null,
} = {}) {
  const cursorRef = useRef(null);
  const isFetchingRef = useRef(false);
  const endReachedRef = useRef(false);
  const themeFiltersKey = normalizeThemeSelection(themeFilters).join("|");
  const startDateKey = getDateKey(startDate);
  const endDateKey = getDateKey(endDate);
  const [events, setEvents] = useState([]);
  const [initialLoading, setInitialLoading] = useState(Boolean(enabled));
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [endReached, setEndReached] = useState(false);

  const loadPage = useCallback(
    async ({ reset = false, refresh = false } = {}) => {
      if (!enabled || isFetchingRef.current) {
        return;
      }

      if (!reset && endReachedRef.current) {
        return;
      }

      isFetchingRef.current = true;
      setError("");

      if (reset) {
        if (refresh) {
          setRefreshing(true);
        } else {
          setInitialLoading(true);
        }

        cursorRef.current = null;
        endReachedRef.current = false;
        setEndReached(false);
      } else {
        setLoadingMore(true);
      }

      try {
        const activeThemeFilters = themeFiltersKey
          ? themeFiltersKey.split("|")
          : [];
        const pageParams = {
          pageSize: DEFAULT_EVENTS_PAGE_SIZE,
          lastDoc: reset ? null : cursorRef.current,
          status,
          organizerId,
          orderByField,
          themeFilters: activeThemeFilters,
          startDate: startDateKey ? new Date(startDateKey) : null,
          endDate: endDateKey ? new Date(endDateKey) : null,
        };
        const page = await getEventsPage(pageParams);

        cursorRef.current = page.lastDoc;
        endReachedRef.current = !page.hasMore;
        setEndReached(!page.hasMore);
        setError("");
        setEvents((currentEvents) =>
          reset ? page.events : [...currentEvents, ...page.events],
        );
      } catch (feedError) {
        console.error("Erro ao carregar feed de eventos:", feedError);
        setError(getEventFeedErrorMessage(feedError));
      } finally {
        isFetchingRef.current = false;
        setInitialLoading(false);
        setLoadingMore(false);
        setRefreshing(false);
      }
    },
    [
      enabled,
      endDateKey,
      orderByField,
      organizerId,
      startDateKey,
      status,
      themeFiltersKey,
    ],
  );

  useEffect(() => {
    cursorRef.current = null;
    endReachedRef.current = false;
    setEvents([]);
    setError("");
    setEndReached(false);

    if (!enabled) {
      setInitialLoading(false);
      return;
    }

    loadPage({ reset: true });
  }, [enabled, loadPage]);

  const loadMore = useCallback(() => {
    loadPage();
  }, [loadPage]);

  const refresh = useCallback(() => {
    loadPage({ reset: true, refresh: true });
  }, [loadPage]);

  const retry = useCallback(() => {
    loadPage({ reset: true });
  }, [loadPage]);

  return {
    events,
    initialLoading,
    loadingMore,
    refreshing,
    error,
    endReached,
    loadMore,
    refresh,
    retry,
  };
}

export function FeedStatus({ children }) {
  return (
    <View style={styles.statusContainer}>
      <Text style={styles.statusText}>{children}</Text>
    </View>
  );
}

export function EventFeedContent({
  events,
  initialLoading,
  loadingMore,
  error,
  endReached,
  onRetry,
  podeAvaliar,
}) {
  if (initialLoading) {
    return (
      <View style={styles.statusContainer}>
        <ActivityIndicator color={colors.primary} />
        <Text style={styles.statusText}>Carregando eventos...</Text>
      </View>
    );
  }

  if (error && events.length === 0) {
    return (
      <View style={styles.statusContainer}>
        <Text style={styles.statusText}>{error}</Text>
        {onRetry ? (
          <TouchableOpacity onPress={onRetry} style={styles.retryButton}>
            <Text style={styles.retryText}>Tentar novamente</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    );
  }

  if (events.length === 0) {
    return <FeedStatus>Nenhum evento encontrado.</FeedStatus>;
  }

  return (
    <>
      {events.map((event) => (
        <Evento key={event.id} evento={event} podeAvaliar={podeAvaliar} />
      ))}

      {loadingMore ? (
        <View style={styles.nextPageLoading}>
          <ActivityIndicator color={colors.primary} />
          <Text style={styles.statusText}>Carregando mais eventos...</Text>
        </View>
      ) : null}

      {error ? (
        <View style={styles.nextPageLoading}>
          <Text style={styles.statusText}>{error}</Text>
          {onRetry ? (
            <TouchableOpacity onPress={onRetry} style={styles.retryButton}>
              <Text style={styles.retryText}>Tentar novamente</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      ) : null}

      {endReached ? <FeedStatus>Fim da lista.</FeedStatus> : null}
    </>
  );
}

export function isCloseToBottom({
  layoutMeasurement,
  contentOffset,
  contentSize,
}) {
  return (
    layoutMeasurement.height + contentOffset.y >= contentSize.height - 300
  );
}

const styles = StyleSheet.create({
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
  nextPageLoading: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
    gap: 8,
  },
});
