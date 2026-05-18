import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  Login,
  LoginScreen,
  Cadastro,
  EventoTesteScreen,
  FeedVisitanteScreen,
  FeedOrganizadorScreen,
  RecuperarSenha,
  CadastroEvento,
} from "../screens";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
<<<<<<< HEAD
        initialRouteName="CadastroEvento"
=======
        initialRouteName="Login"
>>>>>>> 3b8ff1c4f2799701002aa5fe5e060d31611c1fe9
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="EventoTeste" component={LoginScreen} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Cadastro" component={Cadastro} />
        <Stack.Screen name="FeedVisitante" component={FeedVisitanteScreen} />
        <Stack.Screen name="FeedOrganizador" component={FeedOrganizadorScreen} />
        <Stack.Screen name="RecuperarSenha" component={RecuperarSenha} />
        <Stack.Screen name="CadastroEvento" component={CadastroEvento} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}