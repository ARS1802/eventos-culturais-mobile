import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  Login,
  Cadastro,
  EventoTesteScreen,
  FeedVisitanteScreen,
  FeedOrganizadorScreen,
  RecuperarSenha,
  CadastroEvento,
} from "../screens";
import { EventoInfo } from "../components";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="FeedVisitante"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="EventoTeste" component={EventoTesteScreen} />
        <Stack.Screen name="EventoInfo" component={EventoInfo} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Cadastro" component={Cadastro} />
        <Stack.Screen name="FeedVisitante" component={FeedVisitanteScreen} />
        <Stack.Screen
          name="FeedOrganizador"
          component={FeedOrganizadorScreen}
        />
        <Stack.Screen name="RecuperarSenha" component={RecuperarSenha} />
        <Stack.Screen name="CadastroEvento" component={CadastroEvento} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
