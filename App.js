import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import MainContainer from './components/MainContainer.jsx';
import Input from './components/TextInput.jsx';
//no terminal, ponha: npx expo start
export default function App() {
  const [nome, setNome] = useState('');
  return (
      <MainContainer 
      bottom = {<Text>"botom = embaixo"</Text>} 
      top = {<Text>"top = emcima"</Text>}
      >
        <TextInput placeholder="Digite algo..." />

        <Input
        placeholder="Digite seu nome"
        value={nome}
        onChangeText={setNome}
      />
      </MainContainer>
      
  );
}
