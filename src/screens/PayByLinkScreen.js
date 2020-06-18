import * as React from "react";
import * as WebBrowser from "expo-web-browser";
import {
  Button,
  StyleSheet,
  View,
  SafeAreaView,
  Alert,
  Text,
  Linking,
} from "react-native";

import { Cart } from "../components/ShoppingCart";
import { SERVER_URL } from "../constants/General";

export default class PayByLinkScreen extends React.Component {
  state = {
    result: false,
  };

  render() {
    return (
      <View style={styles.container}>
        {this.state.result ? (
          <View style={styles.infoText}>
            <Text style={styles.helpMsg}>
              Payment link opened. You can
              <Text style={styles.linkText} onPress={this.handleHelpLink}>
                {" "}
                setup a webhook{" "}
              </Text>
              to handle the result.
            </Text>
            <View style={styles.payButtonContainer}>
              <Button
                onPress={this.handleBack}
                title="Back"
                color="#0ABF53"
                accessibilityLabel="Checkout and Pay"
              />
            </View>
          </View>
        ) : (
          <SafeAreaView style={styles.container}>
            <Cart />
            <View style={styles.payButtonContainer}>
              <Button
                onPress={this.handlePayByLink}
                title="Pay now"
                color="#0ABF53"
                accessibilityLabel="Checkout and Pay"
              />
            </View>
          </SafeAreaView>
        )}
      </View>
    );
  }

  handlePayByLink = async () => {
    try {
      const response = await fetch(`${SERVER_URL}/api/getPaymentLinks`, {
        method: "POST",
      });
      const data = await response.json();
      if (data.url) {
        let result = await WebBrowser.openBrowserAsync(data.url);
        console.log(result);
        if (["opened", "cancel", "dismiss"].includes(result.type)) {
          this.setState({ result: true });
        }
      }
    } catch (err) {
      console.log(err);
      Alert.alert("Error!", err.message, [{ text: "OK" }], {
        cancelable: true,
      });
    }
  };

  handleHelpLink = () => {
    Linking.openURL("https://docs.adyen.com/development-resources/webhooks");
  };

  handleBack = () => {
    this.setState({ result: false });
  };
}

PayByLinkScreen.navigationOptions = {
  header: null,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  payButtonContainer: {
    margin: 30,
  },
  helpMsg: {
    fontSize: 15,
    alignSelf: "flex-start",
    marginTop: 1,
    padding: 20,
  },
  linkText: {
    color: "blue",
  },
});
