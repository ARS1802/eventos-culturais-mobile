import { View, ScrollView, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function MainContainer({
  top,
  bottom,
  children,
  onScroll,
  refreshControl,
  scrollEventThrottle = 16,
  contentContainerStyle,
}) {
  const insets = useSafeAreaInsets();
  return (
    <View style={styles.feed}>
      {/* TOPO FIXO */}
      {top && (
        <View style={[styles.top, { paddingTop: insets.top }]}>{top}</View>
      )}

      {/* CONTEÚDO SCROLL */}
      <ScrollView
        contentContainerStyle={[
          {
            paddingTop: insets.top,
            paddingBottom: insets.bottom,
          },
          styles.scrollContent,
          contentContainerStyle,
        ]}
        onScroll={onScroll}
        refreshControl={refreshControl}
        scrollEventThrottle={scrollEventThrottle}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>

      {/* BASE FIXA */}
      {bottom && (
        <View style={[styles.bottom, { paddingBottom: insets.bottom }]}>
          {bottom}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  feed: {
    flex: 1,
    backgroundColor: "#F4EBDD",
  },
  top: {
    top: 0,
    width: "100%",
    zIndex: 10,
    alignItems: "center",
  },

  bottom: {
    bottom: 0,
    width: "100%",
    zIndex: 10,
    alignItems: "center",
  },

  scrollContent: {
    paddingHorizontal: 20,
  },
});
