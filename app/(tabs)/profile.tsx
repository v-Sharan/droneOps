import { Card } from "@/components";
import { Text, View } from "@/components/Themed";
import { api } from "@/convex/_generated/api";
import { useAnimatedTheme } from "@/hooks/useAnimateTheme";
import { useTheme } from "@/providers/ThemeContextProvider";
import { useClerk, useUser } from "@clerk/expo";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "convex/react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
  const { signOut } = useClerk();
  const { user : clerk_user } = useUser();
  const user = useQuery(api.user.getUserByClerkId, clerk_user ? { clerkId: clerk_user?.id! } : "skip");
  const department = useQuery(api.departments.getDepartmentById, user ? { id: user.departmentId! } : "skip");
  const sheets = useQuery(api.worksheets.getByUser,"skip");

  const reviewed = sheets?.filter((s) => s.status === "reviewed").length ?? 0;
  const submitted = sheets?.filter((s) => s.status === "submitted").length ?? 0;
  const totalHours = sheets?.reduce((acc, s) => acc + (s.hoursWorked ?? 0), 0) ?? 0;

  const {colors:Colors,radii} = useAnimatedTheme();
  const {theme} = useTheme();

  const handleLogout = () => {
    Alert.alert("Sign out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      { text: "Sign out", style: "destructive", onPress:()=> signOut() },
    ]);
  };

  const initials = (user?.name ?? "U")
    .split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

  const roleLabel: Record<string, string> = {
    employee: "Employee",
    hr: "HR Team",
    admin: "Administrator",
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ScrollView contentContainerStyle={styles.scroll}>

        {/* Avatar header */}
        <View style={styles.avatarSection}>
          {/* <View style={[styles.avatar,{backgroundColor: Colors.primary}]}> */}
            {/* <Text style={styles.avatarText}>{initials}</Text> */}
          {/* </View> */}
          <Image source={{uri: clerk_user?.imageUrl }} style={styles.avatar}/>
          <Text style={[styles.name,{color: Colors.text}]}>{user?.name}</Text>
          <View style={[styles.rolePill,{backgroundColor: Colors.surface, borderRadius: radii.sm}]}>
            <Text style={[styles.roleText,{color: Colors.text}]}>{roleLabel[user?.role ?? "employee"]}</Text>
          </View>
          <Text style={[styles.dept,{color: Colors.textSoft}]}>{department?.name}</Text>
        </View>

        {/* Stats */}
        <Card style={styles.statsCard}>
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={[styles.statVal,{color: Colors.text}]}>{sheets?.length ?? 0}</Text>
              <Text style={[styles.statLabel,{color: Colors.textSoft}]}>Total sheets</Text>
            </View>
            <View style={[styles.statDiv,{backgroundColor: Colors.border}]} />
            <View style={styles.stat}>
              <Text style={[styles.statVal,{color: Colors.text}]}>{reviewed}</Text>
              <Text style={[styles.statLabel,{color: Colors.textSoft}]}>Reviewed</Text>
            </View>
            <View style={[styles.statDiv,{backgroundColor: Colors.border}]} />
            <View style={styles.stat}>
              <Text style={[styles.statVal,{color: Colors.text}]}>{Math.round(totalHours)}</Text>
              <Text style={[styles.statLabel,{color: Colors.textSoft}]}>Total hours</Text>
            </View>
          </View>
        </Card>

        {/* Details */}
        <Text style={[styles.sectionLabel,{color: Colors.textSoft}]}>Account info</Text>
        <Card style={styles.listCard}>
          <InfoRow icon="mail-outline" label="Email" value={user?.email ?? "—"} color={theme.colors.textSoft} border={theme.colors.border} />
          <InfoRow icon="card-outline" label="Employee ID" value={user?.employeeId ?? "—"} color={theme.colors.textSoft} border={theme.colors.border} />
          <InfoRow icon="business-outline" label="Department" value={department?.name ?? "—"} color={theme.colors.textSoft} border={theme.colors.border} />
          <InfoRow icon="shield-outline" label="Role" value={roleLabel[user?.role ?? "employee"]} color={theme.colors.textSoft} border={theme.colors.border} last />
        </Card>

        {/* Actions */}
        <Text style={[styles.sectionLabel,{color: Colors.textSoft}]}>Settings</Text>
        <Card style={styles.listCard}>
          {/* <TouchableOpacity
            style={styles.actionRow}
            onPress={() => router.push("/(auth)/change-password")}
          >
            <View style={[styles.iconWrap, { backgroundColor: Colors.infoBg }]}>
              <Ionicons name="lock-closed-outline" size={18} color={Colors.info} />
            </View>
            <Text style={styles.actionLabel}>Change password</Text>
            <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
          </TouchableOpacity> */}
          <TouchableOpacity style={[styles.actionRow,{borderBottomColor: theme.colors.border}, styles.lastRow]} onPress={handleLogout}>
            <View style={[styles.iconWrap, { backgroundColor: Colors.error }]}>
              <Ionicons name="log-out-outline" size={18} color={theme.colors.error} />
            </View>
            <Text style={[styles.actionLabel, { color: Colors.text }]}>Sign out</Text>
            <Ionicons name="chevron-forward" size={18} color={theme.colors.textSoft} />
          </TouchableOpacity>
        </Card>

        <Text style={[styles.version,{color: Colors.textSecondary}]}>DroneOps v1.0 · Built with ❤️ for your team</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function InfoRow({ icon, label, value, last,color,border }: { icon: any; label: string; value: string; last?: boolean,color:string,border:string }) {
  return (
    <View style={[styles.infoRow,{borderBottomColor: border}, last ? styles.lastRow : null]}>
      <Ionicons name={icon} size={18} color={color} style={{ width: 24 }} />
      <View style={{ flex: 1 }}>
        <Text style={[styles.infoLabel,{color: color}]}>{label}</Text>
        <Text style={[styles.infoValue,{color: color}]}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: 20, paddingBottom: 48 },
  avatarSection: { alignItems: "center", paddingVertical: 28 },
  avatar: {
    width: 80, height: 80, borderRadius: 40,
    alignItems: "center", justifyContent: "center", marginBottom: 12,
  },
  avatarText: { color: "#fff", fontSize: 28, fontWeight: "700" },
  name: { fontSize: 22, fontWeight: "700" },
  rolePill: {
    marginTop: 8, paddingHorizontal: 12, paddingVertical: 4,
  },
  roleText: { fontSize: 12, fontWeight: "600" },
  dept: { fontSize: 13, marginTop: 6 },
  statsCard: { marginBottom: 24, padding: 20 },
  statsRow: { flexDirection: "row" },
  stat: { flex: 1, alignItems: "center", gap: 4 },
  statVal: { fontSize: 24, fontWeight: "700" },
  statLabel: { fontSize: 12 },
  statDiv: { width: 0.5 },
  sectionLabel: {
    fontSize: 12, fontWeight: "600",
    letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 10, marginTop: 4,
  },
  listCard: { marginBottom: 20, padding: 0, overflow: "hidden" },
  infoRow: {
    flexDirection: "row", alignItems: "center", gap: 12,
    padding: 14, borderBottomWidth: 0.5,
  },
  infoLabel: { fontSize: 11 },
  infoValue: { fontSize: 14, fontWeight: "500", marginTop: 1 },
  actionRow: {
    flexDirection: "row", alignItems: "center", gap: 12,
    padding: 14, borderBottomWidth: 0.5,
  },
  lastRow: { borderBottomWidth: 0 },
  iconWrap: { width: 34, height: 34, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  actionLabel: { flex: 1, fontSize: 14, fontWeight: "500" },
  version: { textAlign: "center", fontSize: 12, marginTop: 8 },
});
