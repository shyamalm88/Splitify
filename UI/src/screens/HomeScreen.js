import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { StatusBar } from "expo-status-bar";
import Button from "../components/Button";

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to the UI App!</Text>
      <Text style={styles.subtitle}>
        This is a blank template with essential dependencies.
      </Text>

      <View style={styles.buttonContainer}>
        <Button
          onPress={() => console.log("Button pressed")}
          style={styles.button}
        >
          Get Started
        </Button>
      </View>

      <StatusBar style="auto" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 32,
    textAlign: "center",
    color: "#666",
  },
  buttonContainer: {
    width: "100%",
    maxWidth: 300,
  },
  button: {
    padding: 8,
  },
});

export default HomeScreen;
