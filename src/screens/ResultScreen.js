import * as React from "react";
import { StyleSheet, Button, View, SafeAreaView, Text } from "react-native";

export default function ResultScreen({ route, navigation }) {
  const { params } = route.params;

  const goHome = () => {
    navigation.navigate("Root");
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text>Payment result: {params.resultCode.toUpperCase()}</Text>

      <View style={styles.buttonContainer}>
        <Button
          onPress={goHome}
          title="Home"
          color="#0ABF53"
          accessibilityLabel="Back to Home"
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fafafa",
    padding: 30,
  },
  buttonContainer: {
    marginTop: 30,
    marginBottom: 30,
  },
});
