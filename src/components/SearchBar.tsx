import React, { useState } from "react";
import {
  View,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  Dimensions,
  Keyboard, // Import Keyboard from React Native
} from "react-native";
import AntDesignIcon from "react-native-vector-icons/AntDesign";

interface SearchBarProps {
  onLocationSelect: (location: { latitude: number; longitude: number }) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onLocationSelect }) => {
  const [searchQuery, setSearchQuery] = useState("");

  // Get screen width
  const { width } = Dimensions.get("window");

  /**
   * Handles the search functionality
   * Fetches location data from API based on search query
   */
  const handleSearch = async () => {
    Keyboard.dismiss(); // Close the keyboard

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchQuery
        )}`
      );
      const data = await response.json();
      if (data.length > 0) {
        const { lat, lon } = data[0];
        const searchLocation = {
          latitude: parseFloat(lat),
          longitude: parseFloat(lon),
        };
        onLocationSelect(searchLocation);
      } else {
        Alert.alert("No results found", "Please try a different search query.");
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(
          "Error",
          `Unable to fetch search results: ${error.message}`
        );
      } else {
        Alert.alert("Error", "An unknown error occurred");
      }
    }
  };

  return (
    <View
      style={[
        styles.searchContainer,
        width > 768 && styles.searchContainerLarge,
      ]}
    >
      <AntDesignIcon
        name="search1"
        size={25}
        color="#000"
        style={styles.icon}
      />
      <TextInput
        style={styles.searchBox}
        placeholder="Search"
        value={searchQuery}
        onChangeText={setSearchQuery}
        onSubmitEditing={handleSearch}
      />
      <Button title="Search" onPress={handleSearch} />
    </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    position: "absolute",
    top: 5,
    left: 10,
    right: 10,
    zIndex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 25,
    paddingHorizontal: 10,
    paddingVertical: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  searchContainerLarge: {
    left: "25%",
    right: "25%",
  },
  icon: {
    marginRight: 10,
  },
  searchBox: {
    flex: 1,
    fontSize: 16,
  },
});

export default SearchBar;
