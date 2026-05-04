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

export default function DatePicker() {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [showPicker, setShowPicker] = useState(false);
  const [pickerMode, setPickerMode] = useState("start");

  const handlePress = (mode) => {
    setPickerMode(mode);
    setShowPicker(true);
  };

  const onChange = (event, selectedDate) => {
    setShowPicker(false);
    if (selectedDate) {
      if (pickerMode === "start") {
        setStartDate(selectedDate);
      } else {
        setEndDate(selectedDate);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Datas</Text>
      <View style={styles.row}>
        <TouchableOpacity
          style={styles.input}
          onPress={() => handlePress("start")}
        >
          <Text style={styles.inputText}>
            {startDate ? startDate.toLocaleDateString() : "Início..."}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.input}
          onPress={() => handlePress("end")}
        >
          <Text style={styles.inputText}>
            {endDate ? endDate.toLocaleDateString() : "Fim..."}
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
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={onChange}
          minimumDate={new Date()}
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
