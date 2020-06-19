import * as React from "react";
import { StyleSheet, Button, View, SafeAreaView, Text } from "react-native";

import { Cart } from "../components/ShoppingCart";

export default function ComponentScreen({ route, navigation }) {
  const { type } = route.params;
  
  navigation.setOptions({ headerTitle: getHeaderTitle(type) });

  const handlePayment = () => {
    switch (type) {
      case "scheme":
        navigation.navigate("Card");
      case "ideal":
        navigation.navigate("Card");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Cart />
      <View style={styles.payButtonContainer}>
        <Button
          onPress={handlePayment}
          title="Checkout"
          color="#0ABF53"
          accessibilityLabel="Checkout and Pay"
        />
      </View>
    </SafeAreaView>
  );
}

function getHeaderTitle(type) {
  switch (type) {
    case "scheme":
      return "Credit Card integration";
    case "ideal":
      return "iDeal integration";
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fafafa",
  },
  payButtonContainer: {
    margin: 30,
  },
});
