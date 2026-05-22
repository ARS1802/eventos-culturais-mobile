import { View, Text, StyleSheet } from "react-native";
import color from "../assets/colors";
export function Header({ title, right }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {right && <View style={styles.right}>{right}</View>}
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
  right: {
    position: "absolute",
    right: 12,
    bottom: 6,
  },
  title: {
    color: "#F4EBDD",
    fontSize: 18,
    fontWeight: "bold",
  },
});
