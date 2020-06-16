import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import * as React from "react";

import TabBarIcon from "../components/TabBarIcon";
import DropInScreen from "../screens/DropInScreen";
import ComponentsScreen from "../screens/ComponentsScreen";

const BottomTab = createBottomTabNavigator();
const INITIAL_ROUTE_NAME = "Home";

export default function BottomTabNavigator({ navigation, route }) {
  // Set the header title on the parent stack navigator depending on the
  // currently active tab. Learn more in the documentation:
  // https://reactnavigation.org/docs/en/screen-options-resolution.html
  navigation.setOptions({ headerTitle: getHeaderTitle(route) });

  return (
    <BottomTab.Navigator initialRouteName={INITIAL_ROUTE_NAME}>
      <BottomTab.Screen
        name="DropIn"
        component={DropInScreen}
        options={{
          title: "Drop In",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} name="logo-buffer" />
          ),
        }}
      />
      <BottomTab.Screen
        name="Components"
        component={ComponentsScreen}
        options={{
          title: "Components",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} name="md-card" />
          ),
        }}
      />
    </BottomTab.Navigator>
  );
}

function getHeaderTitle(route) {
  const routeName =
    route.state?.routes[route.state.index]?.name ?? INITIAL_ROUTE_NAME;

  switch (routeName) {
    case "DropIn":
      return "Drop In Component";
    case "Components":
      return "Individual Payment Components";
  }
}
