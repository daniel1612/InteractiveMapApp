import React from "react";
import { View, Text, StyleSheet, Image, Dimensions } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

interface WeatherCardProps {
  locationName: string;
  temperature: number;
  weatherDescription: string;
  iconUrl: string;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  pressure: number;
}

const WeatherCard: React.FC<WeatherCardProps> = ({
  locationName,
  temperature,
  weatherDescription,
  iconUrl,
  feelsLike,
  humidity,
  windSpeed,
  pressure,
}) => {
  const isCelsius = useSelector((state: RootState) => state.unit.isCelsius);

  // Function to convert temperature based on unit
  const convertTemperature = (temp: number) => {
    return isCelsius ? temp : (temp * 9) / 5 + 32;
  };

  // Get screen width
  const { width } = Dimensions.get("window");
  const isSmallScreen = width < 400;

  return (
    <View
      style={[
        styles.weatherView,
        width > 768 && styles.weatherViewLarge,
        isSmallScreen && styles.weatherViewSmall,
      ]}
    >
      <Text style={[styles.locationText, isSmallScreen && styles.smallText]}>
        {locationName}
      </Text>
      <View
        style={
          isSmallScreen ? styles.smallInfoContainer : { flexDirection: "row" }
        }
      >
        <View>
          <Text
            style={[
              styles.secondaryText,
              isSmallScreen && styles.smallSecondaryText,
            ]}
          >
            Now
          </Text>
          <View style={{ flexDirection: "row" }}>
            <Text
              style={[styles.tempText, isSmallScreen && styles.smallTempText]}
            >
              {convertTemperature(temperature).toFixed(1)}
              {"\u00b0"} {isCelsius ? "C" : "F"}
            </Text>
            <Image
              source={{ uri: iconUrl }}
              style={[
                styles.weatherIcon,
                isSmallScreen && styles.smallWeatherIcon,
              ]}
            />
          </View>
          {!isSmallScreen && (
            <Text style={styles.primaryText}>
              Feels like {convertTemperature(feelsLike).toFixed(1)}
              {"\u00b0"} {isCelsius ? "C" : "F"}
            </Text>
          )}
        </View>
        <View
          style={{ justifyContent: "center", alignItems: "flex-end", flex: 1 }}
        >
          <Text style={styles.secondaryText}>{weatherDescription}</Text>
          {!isSmallScreen && (
            <>
              <Text style={styles.primaryText}>Humidity: {humidity}%</Text>
              <Text style={styles.primaryText}>Wind: {windSpeed} m/s</Text>
              <Text style={styles.primaryText}>Pressure: {pressure} hPa</Text>
            </>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  weatherView: {
    backgroundColor: "#FAEBD7",
    borderRadius: 20,
    padding: 10,
    marginHorizontal: 10,
    marginBottom: 10,
    position: "absolute",
    top: 55,
    left: 10,
    right: 10,
    elevation: 5,
    alignItems: "center",
  },
  weatherViewLarge: {
    left: "25%",
    right: "25%",
  },
  weatherViewSmall: {
    top: "10%",
    padding: 8,
  },
  locationText: {
    fontSize: 20,
    fontWeight: "700",
    color: "black",
  },
  primaryText: {
    color: "black",
    fontSize: 13,
  },
  secondaryText: {
    color: "#4a4a4a",
    fontSize: 16,
    fontWeight: "500",
  },
  smallSecondaryText: {
    fontSize: 14,
  },
  tempText: {
    fontSize: 40,
    fontWeight: "900",
    color: "#4a4a4a",
  },
  smallTempText: {
    fontSize: 30,
  },
  weatherIcon: {
    height: 50,
    width: 50,
    resizeMode: "contain",
  },
  smallWeatherIcon: {
    height: 40,
    width: 40,
  },
  smallInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  smallText: {
    fontSize: 16,
  },
  smallDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
});

export default WeatherCard;
