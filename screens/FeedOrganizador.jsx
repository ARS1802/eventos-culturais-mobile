import React from "react";
import { RefreshControl } from "react-native";

import colors from "../assets/colors";
import { Header, Icons, MainContainer, UserIconButton } from "../components";
import { useAuth } from "../navigation/contexts/AuthContext";
import {
  EventFeedContent,
  FeedStatus,
  isCloseToBottom,
  useEventFeed,
} from "../utils/feed";
import { normalizeFeedFilters } from "../utils/eventFilters";

export function FeedOrganizador({ navigation, route }) {
  const { firebaseUser, usuario, loading } = useAuth();
  const isAuthenticated = Boolean(firebaseUser);
  const isOrganizer = usuario?.role === "organizer";
  const canLoadFeed = isAuthenticated && (!usuario || isOrganizer);
  const organizerId = usuario?.id ?? firebaseUser?.uid ?? null;
  const filters = normalizeFeedFilters(route?.params?.filters);
  const feed = useEventFeed({
    enabled: canLoadFeed && Boolean(organizerId),
    organizerId,
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
      originRoute: "FeedOrganizador",
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

    if (usuario && !isOrganizer) {
      return <FeedStatus>Este feed é exclusivo para organizadores.</FeedStatus>;
    }

    return (
      <EventFeedContent
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
      top={
        <Header
          title="Feed Organizador"
          right={
            <UserIconButton
              onPress={() => navigation.navigate("ConfigUser")}
            />
          }
        />
      }
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
          tipo="organizador"
          labelCriar="Criar evento"
          onCriar={() => navigation.navigate("CadastroEvento")}
          labelHistorico="Histórico de eventos"
          onHistorico={() => navigation.navigate("HistoricoOrganizador")}
          onFiltro={abrirFiltros}
        />
      }
    >
      {renderContent()}
    </MainContainer>
  );
}

export default FeedOrganizador;
