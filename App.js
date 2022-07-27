import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Provider } from "react-redux";

import HomeScreen from "./HomeScreen";
import MapScreen from "./MapScreen";
import ChatScreen from "./ChatScreen";
import ListPOIScreen from "./ListPOIScreen";

import { Ionicons } from "@expo/vector-icons";

import {userPseudo} from "./Reducers/pseudo";
import {listPOI} from "./Reducers/listPOI"
import { createStore, combineReducers } from "redux";

import { LogBox } from 'react-native';

LogBox.ignoreAllLogs();

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const store = createStore(combineReducers({ userPseudo, listPOI }));
console.log();



const BottomNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color }) => {
          let iconName;
          if (route.name == "Map") {
            iconName = "ios-navigate";
          } else if (route.name == "Chat") {
            iconName = "ios-chatbubbles";
          } else if (route.name == "POI") {
            iconName = "ios-archive";
          }

          return <Ionicons name={iconName} size={25} color={color} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: "#eb4d4b",
        inactiveTintColor: "#FFFFFF",
        style: {
          backgroundColor: "#130f40",
        },
      }}
    >
      <Tab.Screen name="Map" component={MapScreen} />
      <Tab.Screen name="POI" component={ListPOIScreen} />
      <Tab.Screen name="Chat" component={ChatScreen} />

    </Tab.Navigator>
  );
};

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="BottomNavigator" component={BottomNavigator} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
