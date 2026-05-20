import { useEffect, useRef, useState } from "react";
import { TouchableOpacity, Text, View, Image } from "react-native";
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
          setEvents(Array.isArray(organizerEvents) ? organizerEvents : []);
        }
      } catch (error) {
        console.error("Erro ao carregar eventos de teste:", error);

        if (isMounted) {
          setEventsError("Não foi possível carregar os eventos.");
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
  const { usuario, firebaseUser, logout, loading } = useAuth();
  return (
    <MainContainer
      top={<Header title="Feed Visitante" />}
      bottom={
        <Icons
          tipo="visitante"
          onAvaliar={() => alert("avaliar evento")}
          onFiltro={() => alert("filtrar eventos")}
        />
      }
    >
      <TelaTemp nome={usuario} />
      <Text>
        {"\n"}FEED - VISITANTE - SCREEN{"\n"}
      </Text>
      <Evento
        podeAvaliar
        evento={{
          id: "teste-visitante-1",
          organizerId: "organizer-teste",
          organizerName: "Casa da Cultura",
          title: "Mostra de Cinema",
          description:
            "Johannes Vermeer foi um pintor holandes do seculo XVII, famoso por cenas domesticas luminosas e detalhadas.",
          themes: ["cinema", "cultura_local"],
          address: "Museu Central, sala X",
          startAt: new Date(2026, 4, 15),
          endAt: null,
          poster: null,
          status: "ongoing",
          reviewStats: {
            count: 1,
            ratingSum: 4,
            ratingAverage: 4,
          },
          createdAt: new Date(),
          updatedAt: new Date(),
        }}
      />
      <Evento
        podeAvaliar
        evento={{
          id: "teste-visitante-2",
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
          createdAt: new Date(),
          updatedAt: new Date(),
        }}
      />
    </MainContainer>
  );
};
export const FeedOrganizadorScreen = () => {
  const { usuario, firebaseUser, logout, loading } = useAuth();
  const [selectedImg, setSelectedImg] = useState(null);
  return (
    <MainContainer
      top={<Header title="Feed Organizador" />}
      bottom={
        <Icons
          tipo="organizador"
          onCriar={() => alert("criar evento")}
          onFiltro={() => alert("filtrar eventos")}
        />
      }
    >
      <TelaTemp nome={usuario} />;
      <Evento
        evento={{
          id: "teste-organizador-1",
          organizerId: usuario?.id ?? "organizer-teste",
          organizerName: usuario?.name ?? "Organizador",
          title: "Evento publicado",
          description:
            "Visualizacao de teste para o organizador acompanhar o card publicado.",
          themes: ["outros"],
          address: "Centro Cultural",
          startAt: new Date(),
          endAt: null,
          poster: null,
          status: "ongoing",
          reviewStats: {
            count: 1,
            ratingSum: 5,
            ratingAverage: 5,
          },
          createdAt: new Date(),
          updatedAt: new Date(),
        }}
      />
    </MainContainer>
  );
};
