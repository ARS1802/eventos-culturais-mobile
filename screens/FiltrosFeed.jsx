import React, { useMemo, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import colors from "../assets/colors";
import {
  Bottom,
  DatePicker,
  Header,
  MainContainer,
  MultipleChoicePicker,
} from "../components";
import { EVENT_THEME_OPTIONS } from "../utils/eventThemes";
import {
  normalizeFeedFilters,
  serializeFilterDate,
} from "../utils/eventFilters";

const DEFAULT_ORIGIN_ROUTE = "FeedVisitante";

function getInitialFilters(route) {
  return normalizeFeedFilters(route?.params?.filters);
}

function getDayTime(date) {
  if (!date) {
    return null;
  }

  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  ).getTime();
}

export function FiltrosFeed({ navigation, route }) {
  const originRoute = route?.params?.originRoute ?? DEFAULT_ORIGIN_ROUTE;
  const initialFilters = useMemo(() => getInitialFilters(route), [route]);
  const [selectedThemes, setSelectedThemes] = useState(() =>
    initialFilters.themes,
  );
  const [startDate, setStartDate] = useState(() => initialFilters.startDate);
  const [endDate, setEndDate] = useState(() => initialFilters.endDate);

  const selectedFilters = useMemo(
    () => ({
      themes: selectedThemes,
      startDate: serializeFilterDate(startDate),
      endDate: serializeFilterDate(endDate),
    }),
    [endDate, selectedThemes, startDate],
  );

  function voltar() {
    navigation.goBack();
  }

  function limparFiltros() {
    setSelectedThemes([]);
    setStartDate(null);
    setEndDate(null);
  }

  function aplicarFiltros() {
    if (startDate && endDate && getDayTime(startDate) > getDayTime(endDate)) {
      Alert.alert(
        "Datas inválidas",
        "A data de início não pode ser maior que a data de fim.",
      );
      return;
    }

    const params = { filters: selectedFilters };

    // Os filtros pertencem ao Feed que abriu esta tela e são serializáveis.
    // Route params evitam um Context global e só atualizam a tela de origem.
    if (typeof navigation.popTo === "function") {
      navigation.popTo(originRoute, params);
      return;
    }

    navigation.navigate(originRoute, params);
  }

  return (
    <MainContainer
      top={
        <View style={styles.topContainer}>
          <Header title="Filtros" />
          <TouchableOpacity
            accessibilityLabel="Voltar"
            accessibilityRole="button"
            onPress={voltar}
            style={styles.voltarButton}
          >
            <Text style={styles.voltarText}>{"<"}</Text>
          </TouchableOpacity>
        </View>
      }
      bottom={
        <Bottom edges={[]} transparent style={styles.bottom}>
          <View style={styles.actions}>
            <TouchableOpacity
              accessibilityRole="button"
              onPress={limparFiltros}
              style={[styles.actionButton, styles.clearButton]}
            >
              <Text style={[styles.actionText, styles.clearText]}>Limpar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              accessibilityRole="button"
              onPress={aplicarFiltros}
              style={[styles.actionButton, styles.applyButton]}
            >
              <Text style={styles.actionText}>Aplicar</Text>
            </TouchableOpacity>
          </View>
        </Bottom>
      }
      contentContainerStyle={styles.content}
    >
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Temas</Text>
        <MultipleChoicePicker
          options={EVENT_THEME_OPTIONS}
          selected={selectedThemes}
          onChange={setSelectedThemes}
          compact
          checkboxPosition="left"
        />
      </View>

      <DatePicker
        label="Datas"
        startDate={startDate}
        endDate={endDate}
        onChangeStartDate={setStartDate}
        onChangeEndDate={setEndDate}
        minimumDate={null}
      />
    </MainContainer>
  );
}

export default FiltrosFeed;

const styles = StyleSheet.create({
  topContainer: {
    width: "100%",
  },
  voltarButton: {
    position: "absolute",
    left: 16,
    top: 13,
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 20,
  },
  voltarText: {
    color: colors.white,
    fontSize: 26,
    fontWeight: "800",
  },
  content: {
    paddingTop: 20,
    paddingBottom: 24,
  },
  section: {
    width: "100%",
    gap: 12,
  },
  sectionTitle: {
    color: colors.primary,
    fontSize: 22,
    fontWeight: "800",
  },
  bottom: {
    backgroundColor: colors.primary,
  },
  actions: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  actionButton: {
    minWidth: 130,
    minHeight: 52,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 18,
  },
  clearButton: {
    borderWidth: 2,
    borderColor: colors.background,
  },
  applyButton: {
    backgroundColor: colors.greenContrast,
  },
  actionText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "800",
  },
  clearText: {
    color: colors.background,
  },
});
