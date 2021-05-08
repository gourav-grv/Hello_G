import * as React from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  Alert,
  ToastAndroid,
  TouchableHighlight,
} from "react-native";

const StartPage = ({ navigation }) => {
  const onPressButton = () => {
    console.log("====================================");
    console.log("click");
    console.log("====================================");
    navigation.navigate("Welcome");
    ToastAndroid.showWithGravity(
      "Lets Start Fun With Grv",
      ToastAndroid.SHORT,
      ToastAndroid.BOTTOM
    );
  };
  return (
    <View style={styles.frontPage}>
      <Text style={styles.frontPageTextHeading}>Hello_G!</Text>
      <Text style={styles.frontPageText}>
        LANGUAGE TRANSLATOR USING VOICE RECORGANIZATION
      </Text>
      <TouchableHighlight style={styles.buttonStyle} onPress={onPressButton}>
        <Text style={styles.buttonText}>Lets Start</Text>
      </TouchableHighlight>
    </View>
  );
};
const styles = StyleSheet.create({
  frontPage: {
    backgroundColor: "#5773FF",
    height: "100%",
    width: "100%",
    justifyContent: "center", //Centered vertically
    alignItems: "center", // Centered horizontally
    flex: 1,
  },
  frontPageTextHeading: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 40,
  },
  frontPageText: {
    color: "#FFFFFF",
    textAlign: "center",
    fontSize: 12,
  },
  buttonStyle: {
    marginTop: 50,
    width: "80%",
    height: "8%",
    color: "#B2B6B9",
    backgroundColor: "white",
    borderRadius: 20,
    flexDirection: "column",
    justifyContent: "center",
  },
  buttonText: {
    color: "#5773FF",
    textAlign: "center",
  },
});
export default StartPage;
