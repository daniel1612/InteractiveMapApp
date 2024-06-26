import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Image,
} from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { Coordinate, WeatherInfo } from "../utils/types";
import { fetchMarkers } from "../utils/firebaseService";
import { fetchWeatherData } from "../utils/weatherService";
import { useFocusEffect } from "@react-navigation/native";

const SavedMarkers: React.FC = () => {
  const [markers, setMarkers] = useState<Coordinate[]>([]);
  const [weatherData, setWeatherData] = useState<WeatherInfo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const auth = useSelector((state: RootState) => state.auth);
  const isCelsius = useSelector((state: RootState) => state.unit.isCelsius);
  const isDarkMode = useSelector((state: RootState) => state.theme.isDarkMode);

  /**
   * Loads markers and weather data from the server
   */
  const loadMarkers = async () => {
    if (auth && auth.token && auth.userId) {
      try {
        const fetchedMarkers = await fetchMarkers(auth.token, auth.userId);
        setMarkers(fetchedMarkers);
        const weatherPromises = fetchedMarkers.map((marker) =>
          fetchWeatherData(marker.latitude, marker.longitude)
        );
        const weatherResults = await Promise.all(weatherPromises);
        setWeatherData(weatherResults);
      } catch (error) {
        console.error("Error fetching markers:", error);
        Alert.alert("Error", "Failed to load markers.");
      }
    }
    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      loadMarkers();
    }, [auth])
  );

  /**
   * Renders a single marker item with weather data
   * @param item Coordinate
   * @param index number
   */
  const renderItem = ({ item, index }: { item: Coordinate; index: number }) => {
    const weather = weatherData[index];
    return (
      <View style={styles.markerItem}>
        {weather ? (
          <>
            <Text style={styles.text}>Location: {weather.locationName}</Text>
            <Text style={styles.text}>
              Temperature:{" "}
              {isCelsius
                ? weather.temperature
                : (weather.temperature * 9) / 5 + 32}
              °{isCelsius ? "C" : "F"}
            </Text>
            <Text style={styles.text}>
              Description: {weather.weatherDescription}
            </Text>
            <Image
              source={{ uri: weather.iconUrl }}
              style={styles.weatherIcon}
            />
          </>
        ) : (
          <Text style={styles.text}>Loading weather data...</Text>
        )}
        <Text style={styles.text}>Latitude: {item.latitude}</Text>
        <Text style={styles.text}>Longitude: {item.longitude}</Text>
      </View>
    );
  };

  if (loading) {
    return (
      <View
        style={[
          styles.loadingContainer,
          isDarkMode && styles.darkLoadingContainer,
        ]}
      >
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      {markers.length === 0 ? (
        <Text
          style={[styles.noMarkersText, isDarkMode && styles.darkNoMarkersText]}
        >
          No markers added.
        </Text>
      ) : (
        <FlatList
          data={markers}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.flatListContent}
        />
      )}
    </View>
  );
};

// Styles for the SavedMarkers component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "white",
  },
  darkContainer: {
    backgroundColor: "#121212",
  },
  markerItem: {
    padding: 10,
    marginVertical: 8,
    backgroundColor: "#f9c2ff",
    borderRadius: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  darkLoadingContainer: {
    backgroundColor: "#121212",
  },
  weatherIcon: {
    width: 50,
    height: 50,
  },
  text: {
    color: "black",
  },
  darkText: {
    color: "white",
  },
  noMarkersText: {
    textAlign: "center",
    fontSize: 18,
    color: "black",
  },
  darkNoMarkersText: {
    color: "white",
  },
  flatListContent: {
    paddingBottom: 20,
  },
});

export default SavedMarkers;
