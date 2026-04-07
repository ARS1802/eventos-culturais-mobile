import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
//no terminal, ponha: npx expo start
export default function App() {
  return (
    <View style={styles.container}>
      <Text style={StyleSheet.create({color: '#d1a38f'})}>OMEGA TEXT!!!!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4ebdd',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
