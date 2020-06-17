import React from "react";
import { View, FlatList, StyleSheet, Text, Image } from "react-native";

const DATA = [
  {
    id: "bd7acbea-c1b1-46c2-aed5-3ad53abb28ba",
    title: "Sunglasses",
    image: "sunglasses",
    price: "5.0",
  },
  {
    id: "3ac68afc-c605-48d3-a4f8-fbd91aa97f63",
    title: "Headphones",
    image: "headphones",
    price: "5.0",
  },
];

// this is needed as React Native cannot do dynamic require
function getImage(img) {
  switch (img) {
    case "headphones":
      return require("../../assets/images/headphones.png");
    case "sunglasses":
      return require("../../assets/images/sunglasses.png");
  }
}

function Item({ item, last }) {
  return (
    <View style={[styles.option, last && styles.lastOption]}>
      <View style={styles.itemContainer}>
        <View style={styles.imageContainer}>
          <Image source={getImage(item.image)} style={styles.image} />
        </View>
        <View style={styles.optionTextContainer}>
          <Text style={styles.optionText}>{item.title}</Text>
        </View>
        <View style={styles.optionTextPriceContainer}>
          <Text style={styles.optionPriceText}>{item.price} €</Text>
        </View>
      </View>
    </View>
  );
}

export function Cart() {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>My Cart</Text>
      <FlatList
        data={DATA}
        renderItem={({ item, index }) => <Item item={item} last={index == 1} />}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fafafa",
  },
  heading: {
    fontSize: 20,
    alignSelf: "center",
    marginTop: 10,
    marginBottom: 10,
  },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  imageContainer: {
    marginRight: 12,
    alignSelf: "flex-start",
  },
  image: {
    width: 50,
    height: 50,
  },
  option: {
    backgroundColor: "#fdfdfd",
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: 0,
    borderColor: "#ededed",
  },
  lastOption: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  optionText: {
    fontSize: 18,
    margin: "auto",
  },
  optionTextContainer: {
    alignSelf: "center",
  },
  optionTextPriceContainer: {
    alignSelf: "flex-end",
  },
  optionPriceText: {
    fontSize: 18,
    margin: "auto",
  },
});
