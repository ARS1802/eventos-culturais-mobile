import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  Login,
  Cadastro,
  EventoTesteScreen,
  FeedVisitante,
  FeedOrganizador,
  RecuperarSenha,
  CadastroEvento,
  FiltrosFeed,
  HistoricoVisitante,
  HistoricoOrganizador,
} from "../screens";
import { EventoInfo } from "../components";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="EventoTeste" component={EventoTesteScreen} />
        <Stack.Screen name="EventoInfo" component={EventoInfo} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Cadastro" component={Cadastro} />
        <Stack.Screen name="FeedVisitante" component={FeedVisitante} />
        <Stack.Screen name="FeedOrganizador" component={FeedOrganizador} />
        <Stack.Screen name="RecuperarSenha" component={RecuperarSenha} />
        <Stack.Screen name="CadastroEvento" component={CadastroEvento} />
        <Stack.Screen name="FiltrosFeed" component={FiltrosFeed} />
        <Stack.Screen name="HistoricoVisitante" component={HistoricoVisitante} />
        <Stack.Screen
          name="HistoricoOrganizador"
          component={HistoricoOrganizador}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
