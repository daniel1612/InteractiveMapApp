import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { toggleDarkMode } from "../../store/themeSlice";
import { setUnit } from "../../store/unitSlice";
import {
  resetMarkers,
  resetPolygons,
  setIsInitialMarkers,
  setIsInitialPolygon,
} from "../../store/mapSlice";
import { logout } from "../../store/authSlice";
import { SegmentedButtons } from "react-native-paper";
import { deleteMarkers } from "../../utils/firebaseService";

interface SettingsSectionProps {
  onOpenModal: () => void;
}

/**
 * Settings section component
 * @param onOpenModal - Function to open the password change modal
 */
const SettingsSection: React.FC<SettingsSectionProps> = ({ onOpenModal }) => {
  const dispatch = useDispatch();
  const isDarkMode = useSelector((state: RootState) => state.theme.isDarkMode);
  const isCelsius = useSelector((state: RootState) => state.unit.isCelsius);
  const auth = useSelector((state: RootState) => state.auth);
  const [isDeleting, setIsDeleting] = useState(false);

  /**
   * Toggles the theme between dark and light mode
   */
  const toggleTheme = () => {
    dispatch(toggleDarkMode());
  };

  /**
   * Changes the temperature unit between Celsius and Fahrenheit
   * @param value - The selected unit
   */
  const changeTemperatureUnit = (value: string) => {
    dispatch(setUnit(value === "Celsius"));
  };

  /**
   * Resets all markers
   */
  const handleResetMarkers = () => {
    dispatch(resetMarkers());
    dispatch(setIsInitialMarkers(false));
  };

  /**
   * Resets all polygons
   */
  const handleResetPolygons = () => {
    dispatch(resetPolygons());
    dispatch(setIsInitialPolygon(false));
  };

  /**
   * Logs out the user
   */
  const handleLogout = () => {
    dispatch(logout());
  };

  /**
   * Deletes all markers from the database
   */
  const handleDeleteMarkers = async () => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete all markers?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            setIsDeleting(true);
            try {
              if (auth && auth.token && auth.userId) {
                await deleteMarkers(auth.token, auth.userId);
                alert("Markers deleted successfully.");
                dispatch(resetMarkers());
              } else {
                alert("User not authenticated.");
              }
            } catch (error) {
              alert("Failed to delete markers.");
            } finally {
              setIsDeleting(false);
            }
          },
        },
      ]
    );
  };

  return (
    <View>
      <View style={styles.section}>
        <Text style={[styles.label, isDarkMode && { color: "#fff" }]}>
          Dark Mode
        </Text>
        <Switch value={isDarkMode} onValueChange={toggleTheme} />
      </View>
      <View style={styles.section}>
        <Text style={[styles.label, isDarkMode && { color: "#fff" }]}>
          Temperature Unit
        </Text>
        <SegmentedButtons
          value={isCelsius ? "Celsius" : "Fahrenheit"}
          onValueChange={changeTemperatureUnit}
          buttons={[
            {
              value: "Celsius",
              label: "Celsius",
            },
            {
              value: "Fahrenheit",
              label: "Fahrenheit",
            },
          ]}
        />
      </View>
      <View style={styles.section}>
        <TouchableOpacity onPress={onOpenModal}>
          <Text
            style={[
              styles.label,
              styles.clickable,
              isDarkMode && { color: "#fff" },
            ]}
          >
            Change Password
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.section}>
        <TouchableOpacity onPress={handleResetMarkers}>
          <Text
            style={[
              styles.label,
              styles.clickable,
              isDarkMode && { color: "#fff" },
            ]}
          >
            Reset Markers
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.section}>
        <TouchableOpacity onPress={handleResetPolygons}>
          <Text
            style={[
              styles.label,
              styles.clickable,
              isDarkMode && { color: "#fff" },
            ]}
          >
            Reset Polygons
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.section}>
        <TouchableOpacity onPress={handleDeleteMarkers} disabled={isDeleting}>
          <Text style={[styles.label, styles.clickable, { color: "red" }]}>
            {isDeleting ? (
              <ActivityIndicator color="red" />
            ) : (
              "Delete All Markers"
            )}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.section}>
        <TouchableOpacity onPress={handleLogout}>
          <Text style={[styles.label, styles.clickable, { color: "red" }]}>
            Logout
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Styles for the SettingsSection component
const styles = StyleSheet.create({
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  clickable: {
    textDecorationLine: "underline",
  },
});

export default SettingsSection;
