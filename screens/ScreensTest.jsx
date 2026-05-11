import { useRef, useState } from "react";
import { TouchableOpacity, Text } from "react-native";

import {
  Bottom,
  DatePicker,
  Header,
  Input,
  MainContainer,
  SingleChoicePicker,
  MultipleChoicePicker,
  validarInputs,
} from "../components";

export const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

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
        <Bottom
          tipo="visitante"
          onFiltro={() => alert("filtro!")}
        />
      }
    >
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
export const TelaTemp = ({ nome }) => <Text>{nome}</Text>;
export const CadastroScreen = () => <TelaTemp nome="Cadastro" />;
export const FeedVisitanteScreen = () => <TelaTemp nome="Feed Visitante" />;
export const FeedOrganizadorScreen = () => <TelaTemp nome="Feed Organizador" />;
