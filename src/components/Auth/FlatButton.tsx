import { Pressable, StyleSheet, Text, View } from "react-native";
import { Colors } from "../../styles/styles";
import React from "react";

interface FlatButtonProps {
  children: React.ReactNode;
  onPress: () => void;
}

/**
 * FlatButton Component
 * @param children -  Text to display inside the button
 * @param onPress - Function to execute on button press
 */
const FlatButton: React.FC<FlatButtonProps> = ({ children, onPress }) => {
  return (
    <Pressable
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
      onPress={onPress}
    >
      <View>
        <Text style={styles.buttonText}>{children}</Text>
      </View>
    </Pressable>
  );
};

export default FlatButton;

const styles = StyleSheet.create({
  button: {
    paddingVertical: "1.5%",
    paddingHorizontal: "3%",
  },
  pressed: {
    opacity: 0.7,
  },
  buttonText: {
    textAlign: "center",
    color: Colors.primary100,
    fontSize: 16,
  },
});
