import React, { useCallback, useRef } from "react";
import {
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import colors from "../assets/colors";
import { Bottom, Header, MainContainer } from "../components";
import { useAuth } from "../navigation/contexts/AuthContext";
import {
  EventFeedContent,
  FeedStatus,
  isCloseToBottom,
  useEventFeed,
} from "../utils/feed";

export function HistoricoOrganizador({ navigation }) {
  const { firebaseUser, usuario, loading } = useAuth();
  const firstFocusRef = useRef(true);
  const isAuthenticated = Boolean(firebaseUser);
  const isOrganizer = usuario?.role === "organizer";
  const organizerId = usuario?.id ?? firebaseUser?.uid ?? null;
  const canLoadHistory = isAuthenticated && (!usuario || isOrganizer);
  const feed = useEventFeed({
    enabled: canLoadHistory && Boolean(organizerId),
    organizerId,
  });

  useFocusEffect(
    useCallback(() => {
      if (!canLoadHistory || !organizerId) {
        return;
      }

      if (firstFocusRef.current) {
        firstFocusRef.current = false;
        return;
      }

      feed.refresh();
    }, [canLoadHistory, feed.refresh, organizerId]),
  );

  function handleScroll(event) {
    if (isCloseToBottom(event.nativeEvent)) {
      feed.loadMore();
    }
  }

  function novoEvento() {
    navigation.navigate("CadastroEvento");
  }

  function voltar() {
    if (navigation.canGoBack?.()) {
      navigation.goBack();
      return;
    }

    navigation.navigate("FeedOrganizador");
  }

  function renderContent() {
    if (loading) {
      return <FeedStatus>Verificando login...</FeedStatus>;
    }

    if (!isAuthenticated) {
      return <FeedStatus>Faça login para ver seus eventos.</FeedStatus>;
    }

    if (usuario && !isOrganizer) {
      return (
        <FeedStatus>Este histórico é exclusivo para organizadores.</FeedStatus>
      );
    }

    return (
      <EventFeedContent
        events={feed.events}
        initialLoading={feed.initialLoading}
        loadingMore={feed.loadingMore}
        error={organizerId ? feed.error : "Organizador não encontrado."}
        endReached={feed.endReached}
        onRetry={organizerId ? feed.retry : null}
      />
    );
  }

  return (
    <MainContainer
      top={
        <View style={styles.topContainer}>
          <Header title="Seus eventos" />
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
        isAuthenticated && (!usuario || isOrganizer) ? (
          <Bottom transparent={false} style={styles.bottom}>
            <TouchableOpacity
              accessibilityLabel="Novo Evento"
              accessibilityRole="button"
              activeOpacity={0.82}
              onPress={novoEvento}
              style={styles.newEventButton}
            >
              <Text style={styles.newEventText}>Novo Evento</Text>
            </TouchableOpacity>
          </Bottom>
        ) : null
      }
      contentContainerStyle={styles.content}
    >
      {renderContent()}
    </MainContainer>
  );
}

export default HistoricoOrganizador;

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
  bottom: {
    backgroundColor: colors.primary,
  },
  newEventButton: {
    width: "78%",
    minHeight: 52,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    paddingHorizontal: 20,
    backgroundColor: colors.green,
  },
  newEventText: {
    color: colors.white,
    fontSize: 22,
    fontWeight: "800",
  },
});
