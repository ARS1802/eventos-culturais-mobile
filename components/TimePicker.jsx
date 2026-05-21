import React, {
  forwardRef,
  useImperativeHandle,
  useState,
} from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import COLORS from "../assets/colors";

export const TimePicker = forwardRef(function TimePicker(
  {
    label = "Horarios",
    startTime: controlledStartTime,
    endTime: controlledEndTime,
    onChangeStartTime,
    onChangeEndTime,
    required = false,
    error: externalError,
  },
  ref
) {
  const [internalStartTime, setInternalStartTime] = useState(null);
  const [internalEndTime, setInternalEndTime] = useState(null);
  const [showPicker, setShowPicker] = useState(false);
  const [pickerMode, setPickerMode] = useState("start");
  const [error, setError] = useState("");

  const startTime =
    controlledStartTime === undefined ? internalStartTime : controlledStartTime;
  const endTime =
    controlledEndTime === undefined ? internalEndTime : controlledEndTime;

  function handlePress(mode) {
    setPickerMode(mode);
    setShowPicker(true);
  }

  function formatTime(time, fallback) {
    if (!time) {
      return fallback;
    }

    return time.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function validate() {
    const validationError =
      required && !startTime ? "Selecione o horario de inicio." : "";

    setError(validationError);
    return validationError;
  }

  function onChange(event, selectedTime) {
    setShowPicker(false);

    if (!selectedTime) {
      return;
    }

    setError("");

    if (pickerMode === "start") {
      if (onChangeStartTime) {
        onChangeStartTime(selectedTime);
      } else {
        setInternalStartTime(selectedTime);
      }
      return;
    }

    if (onChangeEndTime) {
      onChangeEndTime(selectedTime);
    } else {
      setInternalEndTime(selectedTime);
    }
  }

  useImperativeHandle(ref, () => ({
    validate,
    openStart() {
      handlePress("start");
    },
    openEnd() {
      handlePress("end");
    },
    getStartTime() {
      return startTime;
    },
    getEndTime() {
      return endTime;
    },
  }));

  const currentError = externalError || error;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.row}>
        <TouchableOpacity
          style={[styles.input, currentError && styles.inputError]}
          onPress={() => handlePress("start")}
        >
          <Text style={styles.inputText}>
            {formatTime(startTime, "Inicio...")}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.input, currentError && styles.inputError]}
          onPress={() => handlePress("end")}
        >
          <Text style={styles.inputText}>
            {formatTime(endTime, "Fim...")}
          </Text>
        </TouchableOpacity>
      </View>
      {currentError ? (
        <Text style={styles.error}>{currentError}</Text>
      ) : null}
      {showPicker && (
        <DateTimePicker
          value={
            pickerMode === "start"
              ? startTime || new Date()
              : endTime || new Date()
          }
          mode="time"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={onChange}
        />
      )}
    </View>
  );
});

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
  inputError: {
    borderColor: COLORS.error,
  },
  inputText: {
    color: COLORS.primary,
    fontSize: 15,
  },
  error: {
    color: COLORS.error,
    marginTop: 5,
  },
});
