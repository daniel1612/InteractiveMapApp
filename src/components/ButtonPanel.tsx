import React from "react";
import { StyleSheet, View, Dimensions } from "react-native";
import { ActivityIndicator, Button } from "react-native-paper";

// Interface for ButtonPanel props
interface ButtonPanelProps {
  startDrawing: () => void;
  completePolygon: () => void;
  handleSaveMarkers: () => void;
  currentPolygonLength: number;
  isSaving: boolean;
}

// Component for the ButtonPanel
const ButtonPanel: React.FC<ButtonPanelProps> = ({
  startDrawing,
  completePolygon,
  handleSaveMarkers,
  currentPolygonLength,
  isSaving,
}) => {
  const { width } = Dimensions.get("window");
  const isTablet = width > 768;

  return (
    <View
      style={
        isTablet
          ? styles.tabletButtonPanelContainer
          : styles.buttonPanelContainer
      }
    >
      <Button
        mode="contained"
        onPress={startDrawing}
        style={isTablet ? styles.buttonTablet : styles.button}
      >
        Start Drawing
      </Button>
      {currentPolygonLength > 0 && (
        <Button
          mode="contained"
          onPress={completePolygon}
          style={isTablet ? styles.buttonTablet : styles.button}
        >
          Complete Polygon
        </Button>
      )}
      <Button
        mode="contained"
        onPress={handleSaveMarkers}
        style={isTablet ? styles.buttonTablet : styles.button}
        disabled={isSaving}
      >
        {isSaving ? <ActivityIndicator color="#fff" /> : "Save Markers"}
      </Button>
    </View>
  );
};

// Styles for the ButtonPanel component
const styles = StyleSheet.create({
  buttonPanelContainer: {
    position: "absolute",
    bottom: 20,
    left: 10,
    right: 10,
    alignItems: "center",
  },
  tabletButtonPanelContainer: {
    position: "absolute",
    bottom: 20,
    left: "20%",
    right: "20%",
    alignItems: "center",
  },
  button: {
    marginVertical: 5,
    width: "90%",
  },
  buttonTablet: {
    marginVertical: 5,
    width: "70%",
  },
});

export default ButtonPanel;
