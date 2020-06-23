import * as React from "react";
import {
  StyleSheet,
  Button,
  View,
  SafeAreaView,
  Text,
  TextInput,
} from "react-native";
import { connect } from "react-redux";

import { errorAlert } from "../util/Alerts";
import { initiatePayment, clearError } from "../store/PaymentSlice";

export function CardScreen({
  navigation,
  payment,
  initiatePayment,
  clearError,
}) {
  const [number, setNumber] = React.useState("");
  const [validNumber, setValidNumber] = React.useState(false);
  const [cvc, setCvc] = React.useState("");
  const [validCvc, setValidCvc] = React.useState(false);
  const [expiryMonth, setExpiryMonth] = React.useState("");
  const [validMonth, setValidMonth] = React.useState(false);
  const [expiryYear, setExpiryYear] = React.useState("");
  const [validYear, setValidYear] = React.useState(false);
  const [holderName, setHolderName] = React.useState("");

  // react to change in error
  React.useEffect(() => {
    errorAlert(payment.error);
    clearError();
  }, [payment.error]);

  // react to change in payment response
  React.useEffect(() => {
    const { paymentRes } = payment;
    async function performAction() {
      if (paymentRes && paymentRes.pspReference) {
        navigation.navigate("Result", { params: paymentRes });
      }
    }
    performAction();
  }, [payment.paymentRes]);

  const validateNumber = (txt) => {
    setNumber(txt.replace(/\s/g, ""));
    // do any needed card number validation
    setValidNumber(
      /^(?:4[0-9]{12}(?:[0-9]{3})?|[25][1-7][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/.test(
        txt
      )
    );
  };

  const validateMonth = (txt) => {
    setExpiryMonth(txt);
    // do any needed card month validation
    setValidMonth(/^(0[1-9])|(1[0-2])$/.test(txt));
  };

  const validateYear = (txt) => {
    setExpiryYear(txt);
    // do any needed card year validation
    setValidYear(/^20[0-9]{2}$/.test(txt));
  };

  const validateCvc = (txt) => {
    setCvc(txt);
    // do any needed card Cvc validation
    setValidCvc(/^[0-9]{3,4}$/.test(txt));
  };

  const handlePayment = () => {
    initiatePayment({
      paymentMethod: {
        type: "scheme",
        number,
        expiryMonth,
        expiryYear,
        cvc,
        holderName,
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.cardItemContainer}>
        <Text style={!validNumber && styles.invalidTxt}>Card number</Text>
        <TextInput
          style={[styles.txtField, !validNumber && styles.invalidField]}
          onChangeText={validateNumber}
          value={number}
          keyboardType="number-pad"
          maxLength={16}
        />
      </View>
      <View style={styles.cardItemRowContainer}>
        <View style={styles.cardItemRow}>
          <Text style={!validMonth && styles.invalidTxt}>Expiry month</Text>
          <TextInput
            style={[styles.txtField, !validMonth && styles.invalidField]}
            onChangeText={validateMonth}
            value={expiryMonth}
            keyboardType="number-pad"
            maxLength={2}
          />
        </View>
        <View style={styles.cardItemRow}>
          <Text style={!validYear && styles.invalidTxt}>Expiry year</Text>
          <TextInput
            style={[styles.txtField, !validYear && styles.invalidField]}
            onChangeText={validateYear}
            value={expiryYear}
            keyboardType="number-pad"
            maxLength={4}
          />
        </View>
        <View style={styles.cardItemRow}>
          <Text style={!validCvc && styles.invalidTxt}>CVC</Text>
          <TextInput
            style={[styles.txtField, !validCvc && styles.invalidField]}
            onChangeText={validateCvc}
            value={cvc}
            keyboardType="number-pad"
            maxLength={4}
          />
        </View>
      </View>
      <View style={styles.cardItemContainer}>
        <Text>Card holder name</Text>
        <TextInput
          style={styles.txtField}
          onChangeText={setHolderName}
          value={holderName}
          maxLength={26}
        />
      </View>
      <View style={styles.cardItemContainer}>
        <Text>
          Works only if you are fully PCI compliant. Contact support for
          details.
        </Text>
      </View>
      <View style={styles.payButtonContainer}>
        <Button
          onPress={handlePayment}
          title="Pay now"
          color="#0ABF53"
          disabled={!(validNumber && validCvc && validMonth && validYear)}
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
  clearError,
};

export default connect(mapStateToProps, mapDispatchToProps)(CardScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fafafa",
  },
  invalidTxt: {
    color: "red",
  },
  invalidField: {
    borderColor: "red",
    color: "red",
  },
  txtField: {
    height: 40,
    borderColor: "grey",
    borderWidth: 1,
    padding: 10,
  },
  cardItemContainer: {
    marginLeft: 30,
    marginRight: 30,
    marginTop: 15,
    marginBottom: 15,
  },
  cardItemRowContainer: {
    marginLeft: 30,
    marginRight: 30,
    marginTop: 15,
    marginBottom: 15,
    display: "flex",
    flexDirection: "row",
  },
  cardItemRow: {
    flexGrow: 1,
  },
  payButtonContainer: {
    margin: 30,
  },
});
