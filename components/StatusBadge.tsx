import { useAnimatedTheme } from "@/hooks/useAnimateTheme";
import { Animated, StyleSheet } from "react-native";
import { Text, View } from "./Themed";

type Status = "draft" | "submitted" | "reviewed";


const StatusBadge = ({ status }: { status: Status }) => {
  const { colors,radii } = useAnimatedTheme();
  
  const config: Record<Status, { bg: Animated.AnimatedInterpolation<string | number>; text: Animated.AnimatedInterpolation<string | number>; label: string }> = {
    draft:     { bg: colors.border,     text: colors.textSoft,    label: "Draft" },
    submitted: { bg: colors.warningBg,  text: colors.warning,     label: "Pending review" },
    reviewed:  { bg: colors.successBg,  text: colors .success,     label: "Reviewed" },
  };
  
  const c = config[status];

  return (
    <View style={[styles.badge, { backgroundColor: c.bg ,borderRadius: radii.full}]}>
      <Text style={[styles.text, { color: c.text }]}>{c.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { paddingHorizontal: 10, paddingVertical: 4 },
  text: { fontSize: 12, fontWeight: "500" },
});

export default StatusBadge;