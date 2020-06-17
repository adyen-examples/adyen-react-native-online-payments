import * as React from "react";
import * as WebBrowser from "expo-web-browser";
import { Button, StyleSheet, View, SafeAreaView, Alert } from "react-native";

import { Cart } from "../components/ShoppingCart";
import { SERVER_URL } from "../constants/General";

export default function PayByLinkScreen() {
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.container}>
        <Cart />
        <View style={styles.payButtonContainer}>
          <Button
            onPress={handlePayByLink}
            title="Pay now"
            color="#0ABF53"
            accessibilityLabel="Checkout and Pay"
          />
        </View>
      </SafeAreaView>
    </View>
  );
}

PayByLinkScreen.navigationOptions = {
  header: null,
};

async function handlePayByLink() {
  try {
    const response = await fetch(`${SERVER_URL}/api/getPaymentLinks`, {
      method: "POST",
    });
    console.log(response);
    const data = await response.json();
    if (data.url) {
      WebBrowser.openBrowserAsync(data.url);
    }
  } catch (err) {
    console.log(err);
    Alert.alert("Error!", err.message, [{ text: "OK" }], { cancelable: true });
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  payButtonContainer: {
    margin: 30,
  },
});
