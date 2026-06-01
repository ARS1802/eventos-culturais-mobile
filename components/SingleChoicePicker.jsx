import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

import COLORS from "../assets/colors";

export function SingleChoicePicker({ options = [], selected, onSelect }) {
  return (
    <View style={styles.container}>
      {options.map((item, index) => {
        const isSelected = selected === item.value;

        return (
          <TouchableOpacity
            key={index}
            style={[styles.card, isSelected && styles.cardSelected]}
            onPress={() => onSelect(item.value)}
          >
            {/* Bolinha */}
            <View style={styles.radio}>
              {isSelected && <View style={styles.radioInner} />}
            </View>

            {/* Textos */}
            <View style={styles.textContainer}>
              <Text style={[styles.title, isSelected && styles.titleSelected]}>
                {item.label}
              </Text>
              {item.description && (
                <Text
                  style={[
                    styles.description,
                    isSelected && styles.descriptionSelected,
                  ]}
                >
                  {item.description}
                </Text>
              )}
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },

  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.accentContrast,
    borderWidth: 1,
    borderColor: COLORS.primary,
    padding: 15,
    borderRadius: 14,
  },

  cardSelected: {
    backgroundColor: COLORS.secondaryContrast,
  },

  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.white,
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },

  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.white,
  },

  textContainer: {
    flex: 1,
  },

  title: {
    color: COLORS.text,
    fontWeight: "bold",
    fontSize: 14,
  },

  titleSelected: {
    color: COLORS.white,
  },

  description: {
    color: COLORS.text,
    fontSize: 12,
    opacity: 0.85,
    marginTop: 2,
  },

  descriptionSelected: {
    color: COLORS.white,
  },
});
