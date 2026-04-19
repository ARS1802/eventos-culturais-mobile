import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Text } from "react-native";
import MainContainer from "../components/MainContainer";
import Header from "../components/Header";
import Bottom from "../components/Bottom";

const Stack = createNativeStackNavigator();

const LoginScreen = () => (
  <MainContainer
    top={<Header title="Espaços Culturais" />}
    bottom={<Bottom tipo="visitante" onFiltro={() => alert("filtro!")} />}
  >
    <Text>
      primeira linha {"\n"} a {"\n"} b {"\n"} c {"\n"} d {"\n"} e {"\n"} f{" "}
      {"\n"} g {"\n"} h {"\n"} i {"\n"} j {"\n"} k {"\n"} x {"\n"} x {"\n"} x{" "}
      {"\n"} x {"\n"}x {"\n"} x {"\n"} x {"\n"}x {"\n"} x {"\n"} x {"\n"}x{" "}
      {"\n"}x {"\n"} x {"\n"}x {"\n"} x {"\n"}x {"\n"}x {"\n"} x {"\n"} x {"\n"}{" "}
      x {"\n"} x {"\n"} x {"\n"} x {"\n"}x {"\n"}x {"\n"}x {"\n"}x {"\n"}x{" "}
      {"\n"}x {"\n"}x {"\n"}x {"\n"}x {"\n"}x {"\n"}x {"\n"}x {"\n"}x {"\n"}x{" "}
      {"\n"}x {"\n"}x {"\n"}x {"\n"}x {"\n"}x {"\n"}x {"\n"}x {"\n"}x {"\n"}x{" "}
      {"\n"}x {"\n"}x {"\n"}x {"\n"}x {"\n"}x {"\n"}x {"\n"}x {"\n"}x {"\n"}x{" "}
      {"\n"}x {"\n"}x {"\n"}x {"\n"}x {"\n"}x {"\n"}x {"\n"}x {"\n"}x {"\n"}x{" "}
      {"\n"}x {"\n"}x {"\n"}x {"\n"}x {"\n"}x {"\n"}x {"\n"}x {"\n"}x {"\n"}x{" "}
      {"\n"}vx {"\n"}x {"\n"}x {"\n"}x {"\n"}FIM DA LINHA {"\n"}
    </Text>
  </MainContainer>
);

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
