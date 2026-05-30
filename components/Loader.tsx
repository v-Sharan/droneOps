import { MyTheme } from "@/constants/Colors";
import { useTheme } from "expo-router";
import { ActivityIndicator, StyleSheet } from "react-native";
import { View } from "./Themed";

const Loader = () => {
  const { colors } = useTheme() as MyTheme;
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: colors.background,
      }}
    >
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
};

export default Loader;

const styles = StyleSheet.create({});
