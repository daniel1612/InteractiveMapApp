import React, { useState } from "react";
import { MapPressEvent, Polygon, Marker } from "react-native-maps";
import MapViewClustering from "react-native-map-clustering";
import { StyleSheet, View, Alert, KeyboardAvoidingView } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import {
  setMarkers,
  setWeatherInfo,
  setPolygons,
  setIsInitialMarkers,
  setIsInitialPolygon,
} from "../store/mapSlice";
import Polygons from "../components/Polygons";
import SearchBar from "../components/SearchBar";
import WeatherCard from "../components/WeatherCard";
import { fetchWeatherData } from "../utils/weatherService";
import { Coordinate } from "../utils/types";
import { staticData } from "../mock/mockData";
import { Button } from "react-native-paper";
import { saveMarkers } from "../utils/firebaseService";
import ButtonPanel from "../components/ButtonPanel";

// Main Map component
const Map: React.FC = () => {
  const dispatch = useDispatch();
  const markers = useSelector((state: RootState) => state.map.markers);
  const polygons = useSelector((state: RootState) => state.map.polygons);
  const weatherInfo = useSelector((state: RootState) => state.map.weatherInfo);
  const useStaticData = useSelector(
    (state: RootState) => state.map.useStaticData
  );
  const IsInitialPolygons = useSelector(
    (state: RootState) => state.map.IsInitialPolygon
  );
  const IsInitialMarkers = useSelector(
    (state: RootState) => state.map.IsInitialMarkers
  );
  const [currentPolygon, setCurrentPolygon] = useState<Coordinate[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isSaving, setIsSaving] = useState(false); // for Loading save
  const auth = useSelector((state: RootState) => state.auth);

  /**
   * Handles map press events for adding markers or drawing polygons
   * @param e MapPressEvent
   */
  const handleMapPress = (e: MapPressEvent) => {
    const coordinate = e.nativeEvent.coordinate;
    console.log("coordinate:", coordinate);

    if (isDrawing) {
      setCurrentPolygon([...currentPolygon, coordinate]);
    } else {
      const newMarkers =
        useStaticData && IsInitialMarkers
          ? [...staticData.markers, coordinate]
          : [...markers, coordinate];
      dispatch(setMarkers(newMarkers));
      fetchWeatherData(coordinate.latitude, coordinate.longitude).then(
        (data) => {
          dispatch(setWeatherInfo(data));
        }
      );
      dispatch(setIsInitialMarkers(false));
    }
  };

  /**
   * Starts polygon drawing mode
   */
  const startDrawing = () => {
    setCurrentPolygon([]);
    setIsDrawing(true);
    Alert.alert(
      "Drawing mode",
      'Tap on the map to add points to your polygon. Press "Complete Polygon" to finish.'
    );
  };

  /**
   * Completes the polygon drawing
   */
  const completePolygon = () => {
    if (currentPolygon.length > 2) {
      if (!IsInitialPolygons) {
        setCurrentPolygon([]);
      }
      if (polygons.length > 0) {
        dispatch(setPolygons([...polygons, currentPolygon]));
      } else if (IsInitialPolygons) {
        dispatch(setPolygons([staticData.polygons[0], currentPolygon]));
      } else {
        dispatch(setPolygons([currentPolygon]));
      }
      setIsDrawing(false);
      dispatch(setIsInitialPolygon(false));
    } else {
      Alert.alert("Invalid Polygon", "A polygon must have at least 3 points.");
    }
  };

  /**
   * Handles location selection from the search bar
   * @param location Coordinate
   */
  const handleLocationSelect = (location: Coordinate) => {
    const newMarkers =
      useStaticData && IsInitialMarkers
        ? [...staticData.markers, location]
        : [...markers, location];
    dispatch(setMarkers(newMarkers));
    fetchWeatherData(location.latitude, location.longitude).then((data) => {
      dispatch(setWeatherInfo(data));
    });
  };

  /**
   * Saves markers to Firebase
   */
  const handleSaveMarkers = async () => {
    setIsSaving(true);
    try {
      if (auth && auth.token && auth.userId) {
        await saveMarkers(auth.token, auth.userId, markers);
        Alert.alert("Success", "Markers saved successfully.");
      } else {
        Alert.alert("Error", "User not authenticated.");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to save markers.");
    } finally {
      setIsSaving(false);
    }
  };

  // Choose which markers to display based on the state
  const displayedMarkers =
    useStaticData && IsInitialMarkers ? staticData.markers : markers;

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView behavior="padding" style={styles.container}>
        <SearchBar onLocationSelect={handleLocationSelect} />
        <MapViewClustering
          style={styles.map}
          initialRegion={{
            latitude: 31.252973,
            longitude: 34.791462,
            latitudeDelta: 1.0,
            longitudeDelta: 1.0,
          }}
          onPress={handleMapPress}
          onPanDrag={isDrawing ? () => {} : undefined} // Prevent move the map while drawing
        >
          {displayedMarkers.map((marker, index) => (
            <Marker key={index} coordinate={marker} />
          ))}
          <Polygons
            polygons={
              useStaticData && IsInitialPolygons
                ? staticData.polygons
                : polygons
            }
            currentPolygon={IsInitialPolygons ? currentPolygon : []}
          />
          {isDrawing && (
            <Polygon
              coordinates={currentPolygon}
              strokeColor="#F00"
              fillColor="rgba(255,0,0,0.5)"
              strokeWidth={2}
            />
          )}
        </MapViewClustering>
      </KeyboardAvoidingView>
      <ButtonPanel
        startDrawing={startDrawing}
        completePolygon={completePolygon}
        handleSaveMarkers={handleSaveMarkers}
        currentPolygonLength={currentPolygon.length}
        isSaving={isSaving}
      />

      {weatherInfo &&
        weatherInfo.temperature !== undefined &&
        markers.length > 0 && (
          <WeatherCard
            locationName={weatherInfo.locationName}
            temperature={weatherInfo.temperature}
            weatherDescription={weatherInfo.weatherDescription}
            iconUrl={weatherInfo.iconUrl}
            feelsLike={weatherInfo.feelsLike}
            humidity={weatherInfo.humidity}
            windSpeed={weatherInfo.windSpeed}
            pressure={weatherInfo.pressure}
          />
        )}
    </View>
  );
};
// Styles for the component
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});

export default Map;
