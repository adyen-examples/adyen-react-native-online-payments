import { Alert } from "react-native";

export const errorAlert = (error) => {
  if (error) {
    console.log(error);
    Alert.alert("Error! ", error, [{ text: "OK" }], {
      cancelable: true,
    });
  }
};
