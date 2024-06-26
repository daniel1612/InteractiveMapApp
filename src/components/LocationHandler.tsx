import React, { useEffect } from "react";
import { Alert } from "react-native";
import * as Location from "expo-location";
import { useDispatch } from "react-redux";
import { setMarkers, setPolygons, setWeatherInfo } from "../store/mapSlice";
import { fetchWeatherData } from "../utils/weatherService";
import { createInitialMarkers, createInitialPolygons } from "../mock/mockData";
import { Coordinate } from "../utils/types";

const DEFAULT_LOCATION: Coordinate = {
  latitude: 31.271424624189123,
  longitude: 34.763215042297404,
};

/**
 * Fetches the current location and updates the store with markers, polygons, and weather info.
 * @param dispatch Redux dispatch function
 */
export const getLocation = async (dispatch: any) => {
  try {
    let { status } = await Location.requestForegroundPermissionsAsync();
    let location;

    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "Permission to access location was denied. Using default location."
      );
      location = {
        coords: DEFAULT_LOCATION,
      };
    } else {
      location = await Location.getCurrentPositionAsync({});
    }

    const { latitude, longitude } = location.coords;
    console.log("Current location:", latitude, longitude);

    dispatch(setMarkers(createInitialMarkers(latitude, longitude)));
    try {
      const weatherData = await fetchWeatherData(latitude, longitude);
      console.log("Weather data:", weatherData);
      dispatch(setWeatherInfo(weatherData));
    } catch (weatherError) {
      console.error("Error fetching weather data:", weatherError);
      Alert.alert("Error", "Failed to fetch weather data.");
    }
  } catch (error) {
    console.error("Error getting location:", error);
    Alert.alert("Error", "Failed to get location.");
    dispatch(
      setMarkers(
        createInitialMarkers(
          DEFAULT_LOCATION.latitude,
          DEFAULT_LOCATION.longitude
        )
      )
    );
    dispatch(
      setPolygons(
        createInitialPolygons(
          DEFAULT_LOCATION.latitude,
          DEFAULT_LOCATION.longitude
        )
      )
    );
    try {
      const weatherData = await fetchWeatherData(
        DEFAULT_LOCATION.latitude,
        DEFAULT_LOCATION.longitude
      );
      console.log("Weather data:", weatherData);
      dispatch(setWeatherInfo(weatherData));
    } catch (weatherError) {
      console.error("Error fetching weather data:", weatherError);
      Alert.alert("Error", "Failed to fetch weather data.");
    }
  }
};

const LocationHandler: React.FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    getLocation(dispatch);
  }, [dispatch]);

  return null;
};

export default LocationHandler;
