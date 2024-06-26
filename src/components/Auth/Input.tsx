import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { Colors } from "../../styles/styles";

interface InputProps {
  label: string;
  keyboardType?: any;
  secure?: boolean;
  onUpdateValue: (value: string) => void;
  value: string;
  isInvalid: boolean;
}

/**
 * Input Component
 * @param label - Label for the input field
 * @param keyboardType - Type of the keyboard for the input field
 * @param secure - If true, masks the input text
 * @param onUpdateValue - Function to update the input value
 * @param value - The current value of the input
 * @param isInvalid - If true, displays the input as invalid
 */
const Input: React.FC<InputProps> = ({
  label,
  keyboardType,
  secure,
  onUpdateValue,
  value,
  isInvalid,
}) => {
  return (
    <View style={styles.inputContainer}>
      <Text style={[styles.label, isInvalid && styles.labelInvalid]}>
        {label}
      </Text>
      <TextInput
        style={[styles.input, isInvalid && styles.inputInvalid]}
        autoCapitalize="none"
        keyboardType={keyboardType}
        secureTextEntry={secure}
        onChangeText={onUpdateValue}
        value={value}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    marginVertical: 8,
    width: "100%",
  },
  label: {
    color: "white",
    marginBottom: 4,
  },
  labelInvalid: {
    color: Colors.error500,
  },
  input: {
    paddingVertical: 8,
    paddingHorizontal: 6,
    backgroundColor: Colors.primary100,
    borderRadius: 4,
    fontSize: 16,
    width: "100%",
  },
  inputInvalid: {
    backgroundColor: Colors.error100,
  },
});

export default Input;
