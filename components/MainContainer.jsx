import React from "react";
import { View, ScrollView, StyleSheet } from "react-native";

export default function MainContainer({ top, bottom, children }) {
  return (
    <View style={styles.feed}>
      {/* TOPO FIXO */}
      {top && <View style={styles.top}>{top}</View>}

      {/* CONTEÚDO SCROLL */}
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: top ? 100 : 20,
            paddingBottom: bottom ? 100 : 20,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>

      {/* BASE FIXA */}
      {bottom && <View style={styles.bottom}>{bottom}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  feed: {
    flex: 1,
    backgroundColor: "#F4EBDD",
  },

  top: {
    position: "absolute",
    top: 0,
    width: "100%",
    zIndex: 10,
    alignItems: "center",
  },

  bottom: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    zIndex: 10,
    alignItems: "center",
  },

  scrollContent: {
    paddingHorizontal: 20,
  },
});