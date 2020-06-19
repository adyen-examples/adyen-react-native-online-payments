import * as React from "react";
import * as WebBrowser from "expo-web-browser";
import { connect } from "react-redux";
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
import { getPaymentLinks } from "../store/PaymentSlice";

export function PayByLinkScreen(props) {
  const [result, setResult] = React.useState(false);

  // react to change in paymentLinksRes
  React.useEffect(() => {
    async function performAction() {
      const { paymentLinksRes } = props.payment;
      if (paymentLinksRes && paymentLinksRes.url) {
        let result = await WebBrowser.openBrowserAsync(paymentLinksRes.url);
        if (["opened", "cancel", "dismiss"].includes(result.type)) {
          setResult(true);
        }
      }
    }
    performAction();
  }, [props.payment.paymentLinksRes]);

  // react to change in error
  React.useEffect(() => {
    const { error } = props.payment;
    if (error) {
      console.log(error);
      Alert.alert("Error!", error.message, [{ text: "OK" }], {
        cancelable: true,
      });
    }
  }, [props.payment.error]);

  const handlePayByLink = async () => {
    props.getPaymentLinks();
  };

  const handleHelpLink = () => {
    Linking.openURL("https://docs.adyen.com/development-resources/webhooks");
  };

  const handleBack = () => {
    setResult(false);
  };

  return (
    <View style={styles.container}>
      {result ? (
        <View style={styles.infoText}>
          <Text style={styles.helpMsg}>
            Payment link opened. You can
            <Text style={styles.linkText} onPress={handleHelpLink}>
              {" "}
              setup a webhook{" "}
            </Text>
            to handle the result.
          </Text>
          <View style={styles.payButtonContainer}>
            <Button
              onPress={handleBack}
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
              onPress={handlePayByLink}
              title="Checkout"
              color="#0ABF53"
              accessibilityLabel="Checkout and Pay"
            />
          </View>
        </SafeAreaView>
      )}
    </View>
  );
}

const mapStateToProps = (state) => ({
  payment: state.payment,
});

const mapDispatchToProps = { getPaymentLinks };

export default connect(mapStateToProps, mapDispatchToProps)(PayByLinkScreen);

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
