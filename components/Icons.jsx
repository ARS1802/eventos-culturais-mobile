import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import colors from "../assets/colors";

function FilterIcon() {
  return (
    <View style={styles.filterIcon}>
      <View style={styles.filterRow}>
        <View style={styles.filterLine} />
        <View style={[styles.filterDot, styles.filterDotRight]} />
      </View>
      <View style={styles.filterRow}>
        <View style={styles.filterLine} />
        <View style={[styles.filterDot, styles.filterDotLeft]} />
      </View>
      <View style={styles.filterRow}>
        <View style={styles.filterLine} />
        <View style={[styles.filterDot, styles.filterDotCenter]} />
      </View>
    </View>
  );
}

function CreateIcon() {
  return (
    <View style={styles.circleIcon}>
      <Text style={styles.plus}>+</Text>
    </View>
  );
}

function ReviewIcon() {
  return (
    <View style={styles.reviewIcon}>
      <View style={styles.bubble}>
        <View style={styles.commentLineLarge} />
        <View style={styles.commentLineSmall} />
      </View>
      <Text style={styles.star}>{"\u2726"}</Text>
    </View>
  );
}

function UserIcon() {
  return (
    <View style={styles.userIcon}>
      <View style={styles.userHead} />
      <View style={styles.userBody} />
    </View>
  );
}

function IconButton({ label, onPress, children }) {
  return (
    <TouchableOpacity
      accessibilityLabel={label}
      accessibilityRole="button"
      activeOpacity={0.75}
      onPress={onPress}
      style={styles.button}
    >
      {children}
    </TouchableOpacity>
  );
}

export function UserIconButton({
  onPress,
  label = "Configurações do usuário",
}) {
  return (
    <IconButton label={label} onPress={onPress}>
      <UserIcon />
    </IconButton>
  );
}

export function Icons({
  tipo = "visitante",
  onAvaliar,
  onCriar,
  onFiltro,
  labelAvaliar = "Avaliar evento",
  labelCriar = "Criar evento",
  labelFiltro = "Filtrar eventos",
}) {
  const isOrganizador = tipo === "organizador";

  return (
    <View style={styles.container}>
      {isOrganizador ? (
        <IconButton label={labelCriar} onPress={onCriar}>
          <CreateIcon />
        </IconButton>
      ) : (
        <IconButton label={labelAvaliar} onPress={onAvaliar}>
          <ReviewIcon />
        </IconButton>
      )}

      <IconButton label={labelFiltro} onPress={onFiltro}>
        <FilterIcon />
      </IconButton>
    </View>
  );
}

export default Icons;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    minHeight: 68,
    paddingHorizontal: 44,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.primary,
  },
  button: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  circleIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
  },
  plus: {
    marginTop: -2,
    color: colors.primary,
    fontSize: 30,
    lineHeight: 32,
    fontWeight: "800",
  },
  filterIcon: {
    width: 32,
    height: 32,
    justifyContent: "center",
    gap: 6,
  },
  filterRow: {
    height: 4,
    justifyContent: "center",
  },
  filterLine: {
    width: 26,
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.background,
  },
  filterDot: {
    position: "absolute",
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: colors.primary,
    backgroundColor: colors.background,
  },
  filterDotLeft: {
    left: 5,
  },
  filterDotCenter: {
    left: 13,
  },
  filterDotRight: {
    right: 3,
  },
  reviewIcon: {
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
  },
  bubble: {
    width: 34,
    height: 30,
    borderRadius: 7,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
  },
  commentLineLarge: {
    width: 16,
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.primary,
  },
  commentLineSmall: {
    width: 10,
    height: 3,
    borderRadius: 2,
    marginTop: 5,
    backgroundColor: colors.primary,
  },
  star: {
    position: "absolute",
    top: -2,
    right: 0,
    color: colors.background,
    fontSize: 20,
    lineHeight: 22,
    fontWeight: "800",
  },
  userIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    backgroundColor: colors.background,
  },
  userHead: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginTop: 4,
    backgroundColor: colors.primary,
  },
  userBody: {
    width: 22,
    height: 12,
    borderTopLeftRadius: 11,
    borderTopRightRadius: 11,
    marginTop: 4,
    backgroundColor: colors.primary,
  },
});
