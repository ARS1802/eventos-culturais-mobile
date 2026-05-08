import { useState } from "react";
import { TouchableOpacity } from "react-native";
import { Text } from "react-native";
import {
  Bottom,
  DatePicker,
  Header,
  Input,
  MainContainer,
  SingleChoicePicker,
  MultipleChoicePicker,
} from "../components";

export const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const [erroEmail, setErroEmail] = useState("");
  const [erroSenha, setErroSenha] = useState("");
  const [opcao, setOpcao] = useState("");
  const [categorias, setCategorias] = useState([]);

  function validar() {
    let valido = true;

    if (email === "") {
      setErroEmail("Email é obrigatório");
    } else {
      setErroEmail("");
      alert("OK");
    }

    if (senha === "") {
      setErroSenha("Senha é obrigatória");
      valido = false;
    } else {
      setErroSenha("");
    }

    if (valido) {
      alert("OK");
    } else {
      alert("Preencha os campos corretamente");
    }
  }

  return (
    <MainContainer
      top={<Header title="Espaços Culturais" />}
      bottom={<Bottom tipo="visitante" onFiltro={() => alert("filtro!")} />}
    >
      <Input
        label="Email"
        placeholder="Digite seu email"
        value={email}
        onChangeText={setEmail}
        error={erroEmail}
      />
      <Input
        label="Senha"
        placeholder="Digite sua senha"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
        error={erroSenha}
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
          }
        ]}
      />
      <TouchableOpacity
        onPress={validar}
        style={{
          backgroundColor: "#D1A38F",
          padding: 15,
          borderRadius: 10,
          alignItems: "center",
          marginTop: 10,
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "bold" }}> Entrar </Text>
      </TouchableOpacity>

      <DatePicker />
    </MainContainer>
  );
};

export const TelaTemp = ({ nome }) => <Text>{nome}</Text>;
export const CadastroScreen = () => <TelaTemp nome="Cadastro" />;
export const FeedVisitanteScreen = () => <TelaTemp nome="Feed Visitante" />;
export const FeedOrganizadorScreen = () => <TelaTemp nome="Feed Organizador" />;
