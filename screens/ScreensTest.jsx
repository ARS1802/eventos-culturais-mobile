import { useEffect, useRef, useState } from "react";
import { TouchableOpacity, Text, View, Image } from "react-native";
import { useAuth } from "../navigation/contexts/AuthContext";
import { converterParaObjeto, formatarValor } from "../utils/converters";
import { ImagePickerButton } from "../components";
import {
  Bottom,
  DatePicker,
  Header,
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
            Titulo={event.title}
            Data={event.startAt}
            NomeOrganizador={organizer?.name}
            Estrelas={event.reviewStats?.ratingAverage ?? 0}
            ImgURL={event.poster?.url ?? ""}
          />
        ))}

      <Evento
        Titulo="Sarau Cultural"
        Data="20/05/2026"
        NomeOrganizador="Coletivo Arte Viva"
        Estrelas={3}
        Comentario="Nao gostei! Fui mal atendido. Nao recomendo."
        ImgURL=""
      />
      <Evento
        Titulo="Festival de Musica Independente"
        Data={new Date()}
        NomeOrganizador="Palco Aberto"
        Estrelas={5}
        Comentario=""
        ImgURL="https://picsum.photos/300/300"
      />
    </MainContainer>
  );
};

export const FeedVisitanteScreen = () => {
  const { usuario, firebaseUser, logout, loading } = useAuth();
  return (
    <MainContainer top={<Header title="Feed Visitante" />}>
      <TelaTemp nome={usuario} />
      <Text>
        {"\n"}FEED - VISITANTE - SCREEN{"\n"}
      </Text>
      <Evento
        Titulo="Mostra de Cinema"
        Data="2026-05-15"
        NomeOrganizador="Casa da Cultura"
        Estrelas={4}
        ImgURL=""
      />
      <Evento
        Titulo="Sarau Cultural"
        Data="2026-05-20"
        NomeOrganizador="Coletivo Arte Viva"
        Estrelas={3}
        Comentario="Nao gostei! Fui mal atendido. Nao recomendo."
        ImgURL=""
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
      bottom={<Bottom />}
    >
      <TelaTemp nome={usuario} />;
      <Evento
        Titulo="Evento publicado"
        Data={new Date()}
        NomeOrganizador={usuario?.name}
        Estrelas={5}
        Comentario="Este card esta usando dados estaticos para testar o componente."
        ImgURL=""
      />
    </MainContainer>
  );
};
