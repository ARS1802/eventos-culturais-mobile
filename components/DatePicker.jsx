import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import COLORS from "../assets/colors";

export function DatePicker({
  label = "Datas",
  mode = "date",
  startDate: controlledStartDate,
  endDate: controlledEndDate,
  onChangeStartDate,
  onChangeEndDate,
  minimumDate = new Date(),
}) {
  const [internalStartDate, setInternalStartDate] = useState(null);
  const [internalEndDate, setInternalEndDate] = useState(null);
  const [showPicker, setShowPicker] = useState(false);
  const [pickerMode, setPickerMode] = useState("start");

  const startDate =
    controlledStartDate === undefined ? internalStartDate : controlledStartDate;
  const endDate =
    controlledEndDate === undefined ? internalEndDate : controlledEndDate;

  const handlePress = (mode) => {
    setPickerMode(mode);
    setShowPicker(true);
  };

  const formatValue = (date, fallback) => {
    if (!date) {
      return fallback;
    }

    if (mode === "time") {
      return date.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      });
    }

    return date.toLocaleDateString("pt-BR");
  };

  const onChange = (event, selectedDate) => {
    setShowPicker(false);
    if (selectedDate) {
      if (pickerMode === "start") {
        if (onChangeStartDate) {
          onChangeStartDate(selectedDate);
        } else {
          setInternalStartDate(selectedDate);
        }
      } else {
        if (onChangeEndDate) {
          onChangeEndDate(selectedDate);
        } else {
          setInternalEndDate(selectedDate);
        }
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.row}>
        <TouchableOpacity
          style={styles.input}
          onPress={() => handlePress("start")}
        >
          <Text style={styles.inputText}>
            {formatValue(startDate, "Início...")}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.input}
          onPress={() => handlePress("end")}
        >
          <Text style={styles.inputText}>
            {formatValue(endDate, "Fim...")}
          </Text>
        </TouchableOpacity>
      </View>
      {showPicker && (
        <DateTimePicker
          value={
            pickerMode === "start"
              ? startDate || new Date()
              : endDate || new Date()
          }
          mode={mode}
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={onChange}
          {...(mode === "date" && minimumDate ? { minimumDate } : {})}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 32,
    marginBottom: 16,
  },
  label: {
    color: COLORS.primary,
    fontWeight: "bold",
    marginBottom: 4,
    marginLeft: 2,
    fontSize: 16,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  input: {
    flex: 1,
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderRadius: 5,
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginRight: 8,
    backgroundColor: COLORS.background,
  },
  inputText: {
    color: COLORS.primary,
    fontSize: 15,
  },
});
