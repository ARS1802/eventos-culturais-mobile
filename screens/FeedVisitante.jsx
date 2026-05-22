import React from "react";
import { RefreshControl } from "react-native";

import colors from "../assets/colors";
import { Header, Icons, MainContainer } from "../components";
import { useAuth } from "../navigation/contexts/AuthContext";
import {
  EventFeedContent,
  FeedStatus,
  isCloseToBottom,
  useEventFeed,
} from "../utils/feed";
import { normalizeFeedFilters } from "../utils/eventFilters";

export function FeedVisitante({ navigation, route }) {
  const { firebaseUser, usuario, loading } = useAuth();
  const isAuthenticated = Boolean(firebaseUser);
  const isVisitor = usuario?.role === "visitor";
  const canLoadFeed = isAuthenticated && (!usuario || isVisitor);
  const filters = normalizeFeedFilters(route?.params?.filters);
  const feed = useEventFeed({
    enabled: canLoadFeed,
    themeFilters: filters.themes,
    startDate: filters.startDate,
    endDate: filters.endDate,
  });

  function handleScroll(event) {
    if (isCloseToBottom(event.nativeEvent)) {
      feed.loadMore();
    }
  }

  function abrirFiltros() {
    navigation.navigate("FiltrosFeed", {
      originRoute: "FeedVisitante",
      filters: {
        themes: filters.themes,
        startDate: route?.params?.filters?.startDate ?? null,
        endDate: route?.params?.filters?.endDate ?? null,
      },
    });
  }

  function renderContent() {
    if (loading) {
      return <FeedStatus>Verificando login...</FeedStatus>;
    }

    if (!isAuthenticated) {
      return <FeedStatus>Faça login para ver os eventos.</FeedStatus>;
    }

    if (usuario && !isVisitor) {
      return <FeedStatus>Este feed é exclusivo para visitantes.</FeedStatus>;
    }

    return (
      <EventFeedContent
        podeAvaliar
        events={feed.events}
        initialLoading={feed.initialLoading}
        loadingMore={feed.loadingMore}
        error={feed.error}
        endReached={feed.endReached}
        onRetry={feed.retry}
      />
    );
  }

  return (
    <MainContainer
      top={<Header title="Feed Visitante" />}
      onScroll={handleScroll}
      refreshControl={
        <RefreshControl
          refreshing={feed.refreshing}
          onRefresh={feed.refresh}
          colors={[colors.primary]}
          tintColor={colors.primary}
        />
      }
      bottom={
        <Icons
          tipo="visitante"
          labelAvaliar="Histórico de avaliações"
          onAvaliar={() => navigation.navigate("HistoricoVisitante")}
          onFiltro={abrirFiltros}
        />
      }
    >
      {renderContent()}
    </MainContainer>
  );
}

export default FeedVisitante;
