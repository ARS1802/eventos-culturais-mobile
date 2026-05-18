import React, {
  forwardRef,
  useImperativeHandle,
  useState,
} from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import COLORS from "../assets/colors";
import { Ionicons } from "@expo/vector-icons";
import {
  validarEmail,
  validarSenha,
  validarNome,
  validarTextoLivre,
} from "../utils/validation.js";

const validators = {
  email: validarEmail,
  senha: validarSenha,
  nome: validarNome,
  textoLivre: validarTextoLivre,
};


export const Input = forwardRef(function Input(
  {
    label,
    secureTextEntry,
    validationType,
    onChangeText,
    onValidation,
    value,
    error: externalError,
    ...props
  },
  ref
) {
  const [isSecure, setIsSecure] = useState(secureTextEntry);
  {
    /* Importante para verificação se a senha está visível */
  }
  const [error, setError] = useState("");

  function validateText(text) {
    const validator = validators[validationType];
    const validationError = validator ? validator(text) : "";

    setError(validationError);

    if (onValidation) {
      onValidation(validationError);
    }

    return validationError;
  }

  function handleValidation(text) {
    validateText(text);

    if (onChangeText) {
      onChangeText(text);
    }
  }

  useImperativeHandle(ref, () => ({
    validate() {
      return validateText(value);
    },
  }));

  const currentError = externalError || error;

  return (
    <View style={styles.container}>
      {label && (
        <Text style={styles.label}>
          {label}
        </Text>
      )}

      <View
        style={[
          styles.inputContainer,
          currentError && styles.inputError,
        ]}
      >

        <TextInput
          style={styles.input}
          secureTextEntry={isSecure}
          placeholderTextColor={COLORS.primary}
          value={value}
          onChangeText={handleValidation}
          {...props}
        />

        {secureTextEntry && (
          <TouchableOpacity
            onPress={() => setIsSecure(!isSecure)}
          >
            <Ionicons
              name={isSecure ? "eye" : "eye-off"}
              size={20}
              color={COLORS.primary}
            />
          </TouchableOpacity>
        )}

      </View>

      {currentError ? (
        <Text style={styles.error}>
          {currentError}
        </Text>
      ) : null}

    </View>
  );
});

export function validarInputs(inputRefs = []) {
  let firstError = "";

  inputRefs.forEach((inputRef) => {
    const validationError = inputRef.current?.validate();

    if (!firstError && validationError) {
      firstError = validationError;
    }
  });

  return firstError;
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
  },
  label: {
    marginBottom: 5,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 10,
    backgroundColor: COLORS.accent,
    paddingHorizontal: 10,
  },
  input: {
    flex: 1,
    padding: 12,
    color: COLORS.primary,
  },
  inputError: {
    borderColor: COLORS.error,
  },
  error: {
    color: COLORS.error,
    marginTop: 5,
  },
  eye: {
    fontSize: 18,
    color: COLORS.primary,
  },
});
