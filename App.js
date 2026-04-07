import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import MainContainer from './components/MainContainer.jsx';
//no terminal, ponha: npx expo start
export default function App() {
  return (
      <MainContainer 
      bottom = {<Text>"botom = embaixo"</Text>} 
      top = {<Text>"top = emcima"</Text>}
      >
        <Text>TEXXXXXXXXxTE</Text>
      </MainContainer>
  );
}
