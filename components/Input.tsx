import { useAnimatedTheme } from "@/hooks/useAnimateTheme";
import { useTheme } from "@/providers/ThemeContextProvider";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  StyleProp,
  StyleSheet,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import { Text, View } from "./Themed";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: StyleProp<ViewStyle>;
  isPassword?: boolean;
}

const Input = ({ label, error, containerStyle, isPassword, ...props }: InputProps) =>{
  const [show, setShow] = useState(false);

  const {colors,radii} = useAnimatedTheme();

  const {theme} = useTheme();

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={[styles.label,{color: colors.textSecondary}]}>{label}</Text>}
      <View style={[styles.inputWrap, { borderColor: error ? colors.error : colors.border, borderRadius: radii.md, backgroundColor: colors.surface }]}>
        <TextInput
          style={[styles.input,{color: theme.colors.text}]}
          placeholderTextColor={theme.colors.text}
          secureTextEntry={isPassword && !show}
          autoCapitalize="none"
          {...props}
        />
        {isPassword && (
          <TouchableOpacity onPress={() => setShow(!show)} style={styles.eye}>
            <Ionicons name={show ? "eye-off-outline" : "eye-outline"} size={20} color={theme.colors.surfaceRaised} />
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={[styles.errorText,{color: colors.error}]}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 16 },
  label: { fontSize: 13, fontWeight: "500", marginBottom: 6 },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    paddingHorizontal: 14,
  },
  input: {
    flex: 1, height: 48, fontSize: 15,
  },
  errorText: { fontSize: 12, marginTop: 4 },
  eye: { padding: 4 },
});

export default Input;