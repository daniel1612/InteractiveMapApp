import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import SettingsSection from "../components/Settings/SettingsSection";
import PasswordModal from "../components/Settings/PasswordModal";

/**
 * Settings screen component
 */
const Settings: React.FC = () => {
  const isDarkMode = useSelector((state: RootState) => state.theme.isDarkMode);
  const [isModalVisible, setIsModalVisible] = useState(false);

  /**
   * Opens the password change modal
   */
  const handleOpenModal = () => {
    setIsModalVisible(true);
  };

  /**
   * Closes the password change modal
   */
  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  return (
    <View style={[styles.container, isDarkMode && { backgroundColor: "#000" }]}>
      <Text style={[styles.text, isDarkMode && { color: "#fff" }]}>
        Settings
      </Text>
      <SettingsSection onOpenModal={handleOpenModal} />
      <PasswordModal isVisible={isModalVisible} onClose={handleCloseModal} />
    </View>
  );
};

// Styles for the Settings component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  text: {
    fontSize: 24,
    marginBottom: 20,
  },
});

export default Settings;
