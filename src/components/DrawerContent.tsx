import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ActivityIndicator,
} from "react-native";
import { DrawerContentComponentProps } from "@react-navigation/drawer";
import { useDispatch } from "react-redux";
import {
  resetMarkers,
  resetPolygons,
  setIsInitialMarkers,
  setIsInitialPolygon,
  setMarkers,
  setPolygons,
  setUseStaticData,
} from "../store/mapSlice";
import { getLocation } from "../components/LocationHandler";
import { staticData } from "../mock/mockData";
import { logout } from "../store/authSlice";
import { Colors } from "../styles/styles";

const DrawerContent: React.FC<DrawerContentComponentProps> = (props) => {
  const dispatch = useDispatch();
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  /**
   * Fetches the current location and dispatches it to the Redux store
   */
  const handleFetchCurrentLocation = async () => {
    setIsLoadingLocation(true);
    try {
      await getLocation(dispatch);
    } finally {
      setIsLoadingLocation(false);
      props.navigation.closeDrawer();
    }
  };

  /**
   * Sets static data for markers and polygons
   */
  const handleUseStaticData = () => {
    dispatch(setMarkers(staticData.markers));
    dispatch(setPolygons(staticData.polygons));
    dispatch(setUseStaticData(true));
    dispatch(setIsInitialPolygon(false));
    props.navigation.closeDrawer();
  };

  /**
   * Resets all markers
   */
  const handleResetMarkers = () => {
    dispatch(resetMarkers());
    dispatch(setIsInitialMarkers(false));
    props.navigation.closeDrawer();
  };

  /**
   * Resets all polygons
   */
  const handleResetPolygons = () => {
    dispatch(resetPolygons());
    dispatch(setIsInitialPolygon(false));
    props.navigation.closeDrawer();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={handleResetMarkers}>
        <Text style={styles.buttonText}>Reset Markers</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleResetPolygons}>
        <Text style={styles.buttonText}>Reset Polygons</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={handleFetchCurrentLocation}
        disabled={isLoadingLocation}
      >
        <Text style={styles.buttonText}>
          {isLoadingLocation ? (
            <ActivityIndicator color="#fff" />
          ) : (
            "Get Current Location"
          )}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleUseStaticData}>
        <Text style={styles.buttonText}>Use Static Data</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, styles.logoutButton]}
        onPress={() => {
          dispatch(logout());
        }}
      >
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    justifyContent: "center",
  },
  button: {
    padding: 15,
    marginVertical: 5,
    backgroundColor: Colors.primary500,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  logoutButton: {
    backgroundColor: "red",
  },
});

export default DrawerContent;
