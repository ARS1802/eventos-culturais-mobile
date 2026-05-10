import React from "react";
import { View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import colors from "../assets/colors";

export function Bottom({
  children,
  transparent = false,
  direction = "column",
  style,
}) {
  return (
    <SafeAreaView
      edges={["bottom"]}
      style={[
        styles.container,
        { backgroundColor: transparent ? "transparent" : colors.primary },
        style,
      ]}
    >
      <View style={[styles.content, { flexDirection: direction }]}>
        {children}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    minHeight: 60,
    paddingHorizontal: 16,
    paddingVertical: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
});
