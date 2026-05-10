import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet
} from 'react-native';

import COLORS from "../assets/colors";

export function MultipleChoicePicker({
  options = [],
  selected = [],
  onChange = () => {},
}) {

  function toggleOption(value) {
    if (selected.includes(value)) {
      // remove
      const newValues = selected.filter(item => item !== value);
      onChange(newValues);

    } else {
      // adiciona
      onChange([...selected, value]);
    }
  }

  return (
    <View style={styles.container}>
      {options.map((item) => {
        const isSelected = selected.includes(item.value);

        return (
          <TouchableOpacity
            key={item.value}
            activeOpacity={0.8}
            style={[
              styles.card,
              isSelected && styles.cardSelected,
              item.disabled && styles.disabled
            ]}
            onPress={() => {
              if (!item.disabled) {
                toggleOption(item.value);
              }
            }}
          >
            {/* ÍCONE */}
            {item.icon && (
              <Text style={styles.icon}>{item.icon}</Text>
            )}

            {/* TEXOS */}
            <View style={styles.textContainer}>
              <Text style={styles.title}>{item.label}</Text>

              {item.description && (
                <Text style={styles.description}>
                  {item.description}
                </Text>
              )}
            </View>

            {/* CHECKBOX */}
            <View style={styles.checkbox}>
              {isSelected && (
                <Text style={styles.check}>✓</Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.accent,
    padding: 15,
    borderRadius: 14,
  },

  cardSelected: {
    backgroundColor: COLORS.primary,
  },

  disabled: {
    opacity: 0.5,
  },

  icon: {
    fontSize: 18,
    marginRight: 10,
  },

  textContainer: {
    flex: 1,
  },

  title: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 14,
  },

  description: {
    color: COLORS.white,
    fontSize: 12,
    opacity: 0.8,
    marginTop: 2,
  },

  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
  },

  check: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 14,
  },
});