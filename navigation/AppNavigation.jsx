import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
<<<<<<< HEAD
import MainContainer from "../components/MainContainer";
import Header from "../components/Header";
import Bottom from "../components/Bottom";
import Input from "../components/Input";
import Button from "../components/Button";
const Stack = createNativeStackNavigator();

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');


  const [erroEmail, setErroEmail] = useState('');
  const [erroSenha, setErroSenha] = useState('');

  function validar() {
    let valido = true;

    if (email === '') {
      setErroEmail('Email é obrigatório');
    } else {
      setErroEmail('');
      alert('OK');
    }

    if (senha === '') {
      setErroSenha('Senha é obrigatória');
      valido = false;
    } else{
      setErroSenha('');
    }

    if (valido) {
      alert('OK');
    } else{
      alert('Preencha os campos corretamente');
    }
  }
  return ( 
 <MainContainer
    top={<Header title="Espaços Culturais" />}
    bottom={
  <View style={{ width: "100%", padding: 10, gap: 8, flexDirection: "row" }}>
    <Button cor="#D8A7B1" texto="Cadastre-se" onPress={() => {}} style={{ flex: 1 }} />
    <Button cor="#BFC9B2" texto="Recuperar senha" onPress={() => {}} style={{ flex: 1 }} />
  </View>
}
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
 <Button cor="#D8A7B1" texto="Entrar" onPress={validar}/>
  </MainContainer>
)};

const TelaTemp = ({ nome }) => <Text>{nome}</Text>;
const CadastroScreen = () => <TelaTemp nome="Cadastro" />;
const FeedVisitanteScreen = () => <TelaTemp nome="Feed Visitante" />;
const FeedOrganizadorScreen = () => <TelaTemp nome="Feed Organizador" />;

=======

import { Text } from "react-native";
import {
  Bottom,
  DatePicker,
  Header,
  Input,
  MainContainer,
  SingleChoicePicker,
} from "../components";

import {
  Login,
  LoginScreen,
  TelaTemp,
  CadastroScreen,
  FeedVisitanteScreen,
  FeedOrganizadorScreen,
} from "../screens";

const Stack = createNativeStackNavigator();

>>>>>>> e844128aa400aa1a0e8918897e5291c3fa346d52
export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Login" component={Login} />
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
