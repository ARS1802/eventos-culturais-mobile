import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../navigation/contexts/AuthContext";
import { converterParaObjeto, formatarValor } from "../utils/converters";
import { ImagePickerButton } from "../components";
import {
  Bottom,
  DatePicker,
  Header,
  Icons,
  Input,
  MainContainer,
  SingleChoicePicker,
  MultipleChoicePicker,
  Evento,
  validarInputs,
} from "../components";
import colors from "../assets/colors";
import { getUser } from "../backend/firebase/services/getUser";
import { getEvent } from "../backend/firebase/services/getEvent";
import {
  DEFAULT_EVENTS_PAGE_SIZE,
  getEventsPage,
} from "../backend/firebase/services/getEventsPage";

const eventosTesteFallback = [
  {
    id: "8xbnw1AHzlx5MIfqTMm1",
    organizerId: "ppOJRZTjkXfw1KZo7mY0APbVEPS2",
    organizerName: "Olimpo",
    title: "Esculturas Gregas",
    description:
    "cool estatua grega!",
    themes: ["escultura", "cultura_local"],
    address: "Museu Central, sala X",
    startAt: new Date(2026, 4, 15, 18, 0, 0),
    endAt: new Date(2026, 5, 15, 20, 0, 0),
    poster: {
      url: "https://firebasestorage.googleapis.com/v0/b/sacadacultural-1987b.firebasestorage.app/o/title%3D7_-_ESTATUA_eventId%3D8xbnw1AHzlx5MIfqTMm1_id%3DMnusO9uXUisf62WTnNRP.png?alt=media&token=4f4c17be-edf5-4b36-8eed-ccc83d9d7e44",
      path: "title=7_-_ESTATUA_eventId=8xbnw1AHzlx5MIfqTMm1_id=MnusO9uXUisf62WTnNRP.png",
      width: 0,
      height: 1800,
      mimeType: "image/png",
      updatedAt: new Date(2026, 4, 18, 20, 4, 17),
    },
    status: "ongoing",
    reviewStats: {
      count: 0,
      ratingSum: 0,
      ratingAverage: 0,
    },
    createdAt: new Date(2026, 5, 15, 10, 0, 0),
    updatedAt: new Date(2026, 6, 15, 12, 0, 0),
  },
  {
    id: "teste-evento-2",
    organizerId: "organizer-teste",
    organizerName: "Coletivo Arte Viva",
    title: "Sarau Cultural",
    description:
      "Noite de poesia, musica e performances abertas para artistas locais.",
    themes: ["musica", "literatura"],
    address: "Praca das Artes",
    startAt: new Date(2026, 4, 20),
    endAt: null,
    poster: null,
    status: "ongoing",
    reviewStats: {
      count: 1,
      ratingSum: 3,
      ratingAverage: 3,
    },
    createdAt: new Date(2026, 3, 20, 10, 0, 0),
    updatedAt: new Date(),
  },
];

export const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [selectedImg, setSelectedImg] = useState(null);

  const emailInputRef = useRef(null);
  const senhaInputRef = useRef(null);

  // pickers
  const [opcao, setOpcao] = useState("");
  const [categorias, setCategorias] = useState([]);

  function entrar() {
    const erro = validarInputs([emailInputRef, senhaInputRef]);

    if (erro) {
      alert(erro);
      return;
    }

    alert("Login OK 🚀");

    console.log({
      email,
      senha,
      opcao,
      categorias,
    });
  }

  return (
    <MainContainer
      top={<Header title="Espaços Culturais" />}
      bottom={
        <Bottom>
          <ImagePickerButton onPick={setSelectedImg} />
        </Bottom>
      }
    >
      <Image
        source={
          "https://firebasestorage.googleapis.com/v0/b/sacadacultural-1987b.firebasestorage.app/o/teste.png?alt=media&token=13d299bd-54bc-4a61-807b-69550ffbf8dd"
        }
        style={{ width: 120, height: 120, borderRadius: 12 }}
      />

      {selectedImg ? (
        <View style={{ marginBottom: 16 }}>
          <Text style={{ color: colors.primary, marginBottom: 8 }}>
            {JSON.stringify(selectedImg, null, 2)}
          </Text>
          <Image
            source={{ uri: selectedImg.uri }}
            style={{ width: 120, height: 120, borderRadius: 12 }}
          />
        </View>
      ) : (
        <Text style={{ color: colors.error, marginBottom: 16 }}>
          Nenhuma imagem selecionada ainda.
        </Text>
      )}

      <Input
        ref={emailInputRef}
        label="Email"
        placeholder="Digite seu email"
        value={email}
        onChangeText={setEmail}
        validationType="email"
      />
      <Input
        ref={senhaInputRef}
        label="Senha"
        placeholder="Digite sua senha"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
        validationType="senha"
      />
      <SingleChoicePicker
        selected={opcao}
        onSelect={setOpcao}
        options={[
          {
            label: "Usuário",
            description: "Esta é uma opção",
            value: "A",
          },
          {
            label: "Organizador",
            description: "Esta é outra opção",
            value: "B",
          },
        ]}
      />
      <MultipleChoicePicker
        selected={categorias}
        onChange={setCategorias}
        options={[
          {
            label: "Artes Visuais",
            description: "Esta é uma opção",
            value: "A",
          },
          {
            label: "Música",
            description: "Esta é outra opção",
            value: "B",
          },
          {
            label: "Teatro",
            description: "Esta é outra opção",
            value: "C",
          },
        ]}
      />
      <TouchableOpacity
        onPress={entrar}
        style={{
          backgroundColor: "#D1A38F",
          padding: 15,
          borderRadius: 10,
          alignItems: "center",
          marginTop: 10,
        }}
      >
        <Text
          style={{
            color: "#fff",
            fontWeight: "bold",
          }}
        >
          Entrar
        </Text>
      </TouchableOpacity>

      <DatePicker />
    </MainContainer>
  );
};

export const TelaTemp = ({ nome }) => {
  return (
    <>
      {Object.entries(converterParaObjeto(nome)).map(([chave, valor]) => (
        <Text key={chave}>
          {chave}: {formatarValor(valor)}
        </Text>
      ))}
    </>
  );
};

export const CadastroScreen = () => {
  return <TelaTemp nome={"Cadastro"} />;
};

function getEventFeedErrorMessage(error) {
  const message = String(error?.message ?? "").toLowerCase();

  if (
    error?.code === "failed-precondition" &&
    message.includes("requires an index")
  ) {
    return "O Firestore precisa de um índice para essa combinação de filtro e ordenação. Crie o índice indicado no console e tente novamente quando ele ficar pronto.";
  }

  return "Não foi possível carregar os eventos.";
}

function useEventFeed({
  organizerId = null,
  status = null,
  enabled = true,
} = {}) {
  const cursorRef = useRef(null);
  const isFetchingRef = useRef(false);
  const endReachedRef = useRef(false);
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
        const page = await getEventsPage({
          pageSize: DEFAULT_EVENTS_PAGE_SIZE,
          lastDoc: reset ? null : cursorRef.current,
          status,
          organizerId,
        });

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
    [enabled, organizerId, status],
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

function FeedStatus({ children }) {
  return (
    <View style={feedStyles.statusContainer}>
      <Text style={feedStyles.statusText}>{children}</Text>
    </View>
  );
}

function EventFeedContent({
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
      <View style={feedStyles.statusContainer}>
        <ActivityIndicator color={colors.primary} />
        <Text style={feedStyles.statusText}>Carregando eventos...</Text>
      </View>
    );
  }

  if (error && events.length === 0) {
    return (
      <View style={feedStyles.statusContainer}>
        <Text style={feedStyles.statusText}>{error}</Text>
        {onRetry ? (
          <TouchableOpacity onPress={onRetry} style={feedStyles.retryButton}>
            <Text style={feedStyles.retryText}>Tentar novamente</Text>
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
        <View style={feedStyles.nextPageLoading}>
          <ActivityIndicator color={colors.primary} />
          <Text style={feedStyles.statusText}>Carregando mais eventos...</Text>
        </View>
      ) : null}

      {error ? (
        <View style={feedStyles.nextPageLoading}>
          <Text style={feedStyles.statusText}>{error}</Text>
          {onRetry ? (
            <TouchableOpacity onPress={onRetry} style={feedStyles.retryButton}>
              <Text style={feedStyles.retryText}>Tentar novamente</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      ) : null}

      {endReached ? <FeedStatus>Fim da lista.</FeedStatus> : null}
    </>
  );
}

function isCloseToBottom({ layoutMeasurement, contentOffset, contentSize }) {
  return layoutMeasurement.height + contentOffset.y >= contentSize.height - 300;
}

export const EventoTesteScreen = () => {
  const [organizer, setOrganizer] = useState(null);
  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [eventsError, setEventsError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function carregarEventos() {
      try {
        setLoadingEvents(true);
        setEventsError("");

        const organizerData = await getUser({
          email: "emailteste2@gmail.com",
        });

        if (!organizerData) {
          throw new Error("Organizador não encontrado.");
        }

        const organizerEvents = await getEvent({
          organizerId: organizerData.id,
        });

        if (isMounted) {
          setOrganizer(organizerData);
          setEvents(
            Array.isArray(organizerEvents) && organizerEvents.length > 0
              ? organizerEvents
              : eventosTesteFallback,
          );
        }
      } catch (error) {
        console.error("Erro ao carregar eventos de teste:", error);

        if (isMounted) {
          setEvents(eventosTesteFallback);
          setEventsError("");
        }
      } finally {
        if (isMounted) {
          setLoadingEvents(false);
        }
      }
    }

    carregarEventos();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <MainContainer top={<Header title="Teste Evento" />}>
      {loadingEvents && <Text>Carregando eventos...</Text>}

      {eventsError ? <Text>{eventsError}</Text> : null}

      {!loadingEvents &&
        !eventsError &&
        events.map((event) => (
          <Evento
            key={event.id}
            evento={{
              ...event,
              organizerName: event.organizerName ?? organizer?.name ?? "",
            }}
            podeAvaliar
          />
        ))}
    </MainContainer>
  );
};

export const FeedVisitanteScreen = () => {
  const feed = useEventFeed();

  function handleScroll(event) {
    if (isCloseToBottom(event.nativeEvent)) {
      feed.loadMore();
    }
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
          onAvaliar={() => alert("histórico de avaliações")}
          onFiltro={() => alert("filtrar eventos")}
        />
      }
    >
      <EventFeedContent
        podeAvaliar
        events={feed.events}
        initialLoading={feed.initialLoading}
        loadingMore={feed.loadingMore}
        error={feed.error}
        endReached={feed.endReached}
        onRetry={feed.retry}
      />
    </MainContainer>
  );
};
export const FeedOrganizadorScreen = ({ navigation }) => {
  const { usuario, firebaseUser } = useAuth();
  const organizerId = usuario?.id ?? firebaseUser?.uid ?? null;
  const feed = useEventFeed({
    organizerId,
    status: null,
    enabled: Boolean(organizerId),
  });

  function handleScroll(event) {
    if (isCloseToBottom(event.nativeEvent)) {
      feed.loadMore();
    }
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
      <EventFeedContent
        events={feed.events}
        initialLoading={feed.initialLoading}
        loadingMore={feed.loadingMore}
        error={organizerId ? feed.error : "Organizador não encontrado."}
        endReached={feed.endReached}
        onRetry={organizerId ? feed.retry : null}
      />
    </MainContainer>
  );
};

const feedStyles = StyleSheet.create({
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
