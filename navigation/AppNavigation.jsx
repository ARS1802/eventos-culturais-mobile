import React from "react";
import { useState } from "react";
import { TouchableOpacity } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

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
