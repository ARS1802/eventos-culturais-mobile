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

export function FeedOrganizador({ navigation }) {
  const { firebaseUser, usuario, loading } = useAuth();
  const isAuthenticated = Boolean(firebaseUser);
  const isOrganizer = usuario?.role === "organizer";
  const canLoadFeed = isAuthenticated && (!usuario || isOrganizer);
  const feed = useEventFeed({ enabled: canLoadFeed });

  function handleScroll(event) {
    if (isCloseToBottom(event.nativeEvent)) {
      feed.loadMore();
    }
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
      top={<Header title="Feed Organizador" />}
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
          onCriar={() => navigation.navigate("CadastroEvento")}
          onFiltro={() => alert("filtrar eventos")}
        />
      }
    >
      {renderContent()}
    </MainContainer>
  );
}

export default FeedOrganizador;
