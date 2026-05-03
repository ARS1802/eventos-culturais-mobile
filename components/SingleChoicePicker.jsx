import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function SingleChoicePicker({
  options = [],
  selected,
  onSelect
}) {
  return (
    <View style={styles.container}>
      {options.map((item, index) => {
        const isSelected = selected === item.value;

        return (
          <TouchableOpacity
            key={index}
            style={[
              styles.card,
              isSelected && styles.cardSelected
            ]}
            onPress={() => onSelect(item.value)}
          >
            {/* Bolinha */}
            <View style={styles.radio}>
              {isSelected && <View style={styles.radioInner} />}
            </View>

            {/* Textos */}
            <View style={styles.textContainer}>
              <Text style={styles.title}>{item.label}</Text>
              {item.description && (
                <Text style={styles.description}>
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
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E6D3A3', // bege claro
    padding: 15,
    borderRadius: 14,
  },

  cardSelected: {
    backgroundColor: '#D1A38F', // cor selecionada
  },

  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#fff',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },

  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
  },

  textContainer: {
    flex: 1,
  },

  title: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },

  description: {
    color: '#fff',
    fontSize: 12,
    opacity: 0.8,
    marginTop: 2,
  },
});