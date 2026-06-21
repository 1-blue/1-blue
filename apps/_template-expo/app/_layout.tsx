import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View, StyleSheet } from "react-native";

const RootLayout = () => {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Slot />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
});

export default RootLayout;
