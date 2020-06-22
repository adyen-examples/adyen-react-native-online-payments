import * as React from "react";
import { StyleSheet, Button, View, SafeAreaView, Text } from "react-native";
import * as WebBrowser from "expo-web-browser";
import { connect } from "react-redux";
import { Picker } from "@react-native-community/picker";
import { Linking } from "expo";
import Constants from "expo-constants";

import { errorAlert } from "../util/Alerts";
import { initiatePayment } from "../store/PaymentSlice";

export function IDealScreen({ navigation, payment, initiatePayment }) {
  const [issuer, setIssuer] = React.useState("");
  const [validIssuer, setValidIssuer] = React.useState(false);
  const [startPayment, setStartPayment] = React.useState(false);

  // react to change in error
  React.useEffect(() => {
    errorAlert(payment.error);
  }, [payment.error]);

  // react to change in payment response
  React.useEffect(() => {
    const { paymentRes } = payment;
    async function performAction() {
      if (paymentRes && validIssuer && startPayment) {
        try {
          addLinkingListener();

          await WebBrowser.openBrowserAsync(paymentRes.redirect.url);
          // https://github.com/expo/expo/issues/5555
          if (Constants.platform.ios) {
            removeLinkingListener();
          }
        } catch (err) {
          errorAlert(err.message);
        }
      }
    }
    performAction();
  }, [payment.paymentRes]);

  const handleRedirect = (event) => {
    if (Constants.platform.ios) {
      WebBrowser.dismissBrowser();
    } else {
      removeLinkingListener();
    }

    let data = Linking.parse(event.url);

    if (data.queryParams && data.queryParams.type === "complete") {
      navigation.navigate("Result", { params: data.queryParams });
    } else {
      errorAlert("Payment not complete");
      console.log(data);
    }
  };
  const addLinkingListener = () => {
    Linking.addEventListener("url", handleRedirect);
  };

  const removeLinkingListener = () => {
    Linking.removeEventListener("url", handleRedirect);
  };

  const validateIssuer = (txt) => {
    setIssuer(txt.replace(/\s/g, ""));
    // do any needed validation
    setValidIssuer(!!txt);
  };

  const handlePayment = () => {
    initiatePayment({
      paymentMethod: {
        type: "ideal",
        issuer,
      },
    });
    setStartPayment(true);
  };

  const getBanks = () => {
    let items = [];
    if (payment.paymentMethodInUse && payment.paymentMethodInUse[0]) {
      const select = payment.paymentMethodInUse[0].details.filter(
        (it) => it.type === "select"
      );
      items = select.length > 0 ? select[0].items : [];
    }
    return items;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.cardItemContainer}>
        <Text style={!validIssuer && styles.invalidTxt}>Select Bank</Text>
        <Picker
          selectedValue={issuer}
          style={[styles.txtField, !validIssuer && styles.invalidField]}
          onValueChange={validateIssuer}
        >
          <Picker.Item label="" value="" />
          {getBanks().map((it) => (
            <Picker.Item label={it.name} value={it.id} key={it.id} />
          ))}
        </Picker>
      </View>
      <View style={styles.payButtonContainer}>
        <Button
          onPress={handlePayment}
          title="Pay now"
          color="#0ABF53"
          disabled={!validIssuer}
          accessibilityLabel="Checkout and Pay"
        />
      </View>
    </SafeAreaView>
  );
}

const mapStateToProps = (state) => ({
  payment: state.payment,
});

const mapDispatchToProps = {
  initiatePayment,
};

export default connect(mapStateToProps, mapDispatchToProps)(IDealScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fafafa",
  },
  invalidTxt: {
    color: "red",
  },
  invalidField: {
    color: "red",
  },
  txtField: {
    height: 50,
    borderColor: "grey",
    color: "black",
    borderWidth: 1,
    padding: 10,
  },
  cardItemContainer: {
    marginLeft: 30,
    marginRight: 30,
    marginTop: 15,
    marginBottom: 15,
  },
  payButtonContainer: {
    margin: 30,
  },
});
