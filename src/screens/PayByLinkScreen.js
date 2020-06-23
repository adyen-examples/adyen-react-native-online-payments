import * as React from "react";
import * as WebBrowser from "expo-web-browser";
import { connect } from "react-redux";
import { Button, StyleSheet, View, SafeAreaView, Text } from "react-native";
import { Linking } from "expo";
import Constants from "expo-constants";

import { errorAlert } from "../util/Alerts";
import { Cart } from "../components/ShoppingCart";
import { getPaymentLinks, clearError } from "../store/PaymentSlice";

export function PayByLinkScreen(props) {
  const [result, setResult] = React.useState(false);

  // react to change in paymentLinksRes
  React.useEffect(() => {
    async function performAction() {
      const { paymentLinksRes } = props.payment;
      if (paymentLinksRes && paymentLinksRes.url) {
        addLinkingListener();
        await WebBrowser.openBrowserAsync(paymentLinksRes.url);
        // https://github.com/expo/expo/issues/5555
        if (Constants.platform.ios) {
          removeLinkingListener();
        }
      }
    }
    performAction();
  }, [props.payment.paymentLinksRes]);

  // react to change in error
  React.useEffect(() => {
    errorAlert(props.payment.error);
    props.clearError();
  }, [props.payment.error]);

  const handleRedirect = (event) => {
    if (Constants.platform.ios) {
      WebBrowser.dismissBrowser();
    } else {
      removeLinkingListener();
    }

    let data = Linking.parse(event.url);
    console.log(data);
    if (data) {
      setResult(true);
    }
  };
  const addLinkingListener = () => {
    Linking.addEventListener("url", handleRedirect);
  };

  const removeLinkingListener = () => {
    Linking.removeEventListener("url", handleRedirect);
  };

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
            Payment process completed. You need to
            <Text style={styles.linkText} onPress={handleHelpLink}>
              {" "}
              setup a webhook{" "}
            </Text>
            to handle the result in the app.
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

const mapDispatchToProps = { getPaymentLinks, clearError };

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
