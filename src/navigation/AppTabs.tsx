import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createDrawerNavigator } from "@react-navigation/drawer";
import Ionicons from "react-native-vector-icons/Ionicons";
import Map from "../screens/Map";
import Settings from "../screens/Settings";
import SavedMarkersScreen from "../screens/SavedMarkers";
import DrawerContent from "../components/DrawerContent";

// Create tab and drawer navigators
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

/**
 * DrawerNavigator Component
 * Contains the drawer navigation setup
 */
const DrawerNavigator = () => {
  return (
    <Drawer.Navigator drawerContent={(props) => <DrawerContent {...props} />}>
      <Drawer.Screen name="Map Options" component={Map} />
    </Drawer.Navigator>
  );
};

/**
 * AppTabs Component
 * Main tab navigation setup
 */
const AppTabs: React.FC = () => {
  return (
    <Tab.Navigator
      initialRouteName="Map"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Map") {
            iconName = focused ? "map" : "map-outline";
          } else if (route.name === "Settings") {
            iconName = focused ? "settings" : "settings-outline";
          } else if (route.name === "SavedMarkers") {
            iconName = focused ? "list" : "list-outline";
          }

          return (
            <Ionicons name={iconName as string} size={size} color={color} />
          );
        },
        tabBarShowLabel: false,
      })}
    >
      <Tab.Screen
        name="Map"
        component={DrawerNavigator}
        options={{ title: "Map" }}
      />
      <Tab.Screen
        name="Settings"
        component={Settings}
        options={{ title: "Settings" }}
      />
      <Tab.Screen
        name="SavedMarkers"
        component={SavedMarkersScreen}
        options={{ title: "Saved Markers" }}
      />
    </Tab.Navigator>
  );
};

export default AppTabs;
