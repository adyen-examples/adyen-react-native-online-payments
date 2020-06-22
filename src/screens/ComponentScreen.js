import * as React from "react";
import { StyleSheet, Button, View, SafeAreaView } from "react-native";
import { connect } from "react-redux";

import { Cart } from "../components/ShoppingCart";
import { setPaymentMethodInUse } from "../store/PaymentSlice";

export function ComponentScreen({
  route,
  navigation,
  payment,
  paymentMethodInUse,
}) {
  const { type } = route.params;

  navigation.setOptions({ headerTitle: getHeaderTitle(type) });

  // React to paymentMethods updates
  React.useEffect(() => {
    paymentMethodInUse(type);
  }, [payment.paymentMethodsRes]);

  const handlePayment = () => {
    switch (type) {
      case "scheme":
        navigation.navigate("Card");
        break;
      case "ideal":
        navigation.navigate("IDeal");
        break;
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
      return "iDEAL integration";
  }
}

const mapStateToProps = (state) => ({
  payment: state.payment,
});
const mapDispatchToProps = { paymentMethodInUse: setPaymentMethodInUse };

export default connect(mapStateToProps, mapDispatchToProps)(ComponentScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fafafa",
  },
  payButtonContainer: {
    margin: 30,
  },
});
