import React from "react";
import { useState } from "react";
import { TouchableOpacity } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { Text } from "react-native";
import MainContainer from "../components/MainContainer";
import Header from "../components/Header";
import Bottom from "../components/Bottom";
import Input from "../components/Input";
import DatePicker from "../components/DatePicker";

const Stack = createNativeStackNavigator();

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const [erroEmail, setErroEmail] = useState("");
  const [erroSenha, setErroSenha] = useState("");

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

const TelaTemp = ({ nome }) => <Text>{nome}</Text>;
const CadastroScreen = () => <TelaTemp nome="Cadastro" />;
const FeedVisitanteScreen = () => <TelaTemp nome="Feed Visitante" />;
const FeedOrganizadorScreen = () => <TelaTemp nome="Feed Organizador" />;

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Cadastro" component={CadastroScreen} />
        <Stack.Screen name="FeedVisitante" component={FeedVisitanteScreen} />
        <Stack.Screen
          name="FeedOrganizador"
          component={FeedOrganizadorScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
