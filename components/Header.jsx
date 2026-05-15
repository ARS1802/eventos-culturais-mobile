import { View, Text, StyleSheet } from "react-native";
import color from "../assets/colors";
export function Header({ title }) {
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
    backgroundColor: color.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    color: "#F4EBDD",
    fontSize: 18,
    fontWeight: "bold",
  },
});
