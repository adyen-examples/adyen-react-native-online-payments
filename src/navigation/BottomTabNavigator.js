import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import * as React from "react";

import TabBarIcon from "../components/TabBarIcon";
import PayByLinkScreen from "../screens/PayByLinkScreen";
import ComponentListScreen from "../screens/ComponentListScreen";

const BottomTab = createBottomTabNavigator();
const INITIAL_ROUTE_NAME = "PayByLink";

export default function BottomTabNavigator({ navigation, route }) {
  // Set the header title on the parent stack navigator depending on the
  // currently active tab. Learn more in the documentation:
  // https://reactnavigation.org/docs/en/screen-options-resolution.html
  navigation.setOptions({ headerTitle: getHeaderTitle(route) });

  return (
    <BottomTab.Navigator initialRouteName={INITIAL_ROUTE_NAME}>
      <BottomTab.Screen
        name="PayByLink"
        component={PayByLinkScreen}
        options={{
          title: "Pay by Link",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} name="logo-buffer" />
          ),
        }}
      />
      <BottomTab.Screen
        name="Components"
        component={ComponentListScreen}
        options={{
          title: "API only",
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
    case "PayByLink":
      return "Pay by Link integration";
    case "Components":
      return "Components with API only";
  }
}
