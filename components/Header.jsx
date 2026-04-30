import { View, Text, StyleSheet } from "react-native";

export default function Header({ title }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 60,
    backgroundColor: "#D1A38F",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    color: "#F4EBDD",
    fontSize: 18,
    fontWeight: "bold",
  },
});
