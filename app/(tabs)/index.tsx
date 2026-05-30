import { Card, StatusBadge } from "@/components";
import { Text, View } from "@/components/Themed";
import { useAnimatedTheme } from "@/hooks/useAnimateTheme";
import { useTheme } from "@/providers/ThemeContextProvider";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  // const { user } = useAuth();
  // const today = new Date().toISOString().split("T")[0];
  // const todaySheet = useQuery(
  //   api.worksheets.getByUserAndDate,
  //   user ? { userId: user._id, date: today } : "skip"
  // );
  // const recentSheets = useQuery(
  //   api.worksheets.getByUser,
  //   user ? { userId: user._id } : "skip"
  // );

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  const [refreshing, setRefreshing] = React.useState(false);

  const {colors:Colors} = useAnimatedTheme();

  const {theme} = useTheme()

  const user = {
    name: "Sharan",
    department: "Operations",
    employeeId: "EMP12345",
  }

  const todaySheet = {
    siteLocation: "New York Office",
    hoursWorked: 8,
    status: "reviewed",
    hrRemark: "Great work!"
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => setRefreshing(false)} />}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{greeting()},</Text>
            <Text style={styles.name}>{user?.name?.split(" ")[0] ?? "—"}</Text>
            <Text style={styles.dept}>{user?.department} · {user?.employeeId}</Text>
          </View>
          <TouchableOpacity style={styles.avatarWrap}>
            <Text style={styles.avatarText}>
              {(user?.name ?? "U").split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Today's worksheet card */}
        <Text style={styles.sectionLabel}>Today — {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "short" })}</Text>

        {todaySheet ? (
          <Card style={styles.todayCard} elevated>
            <View style={styles.cardRow}>
              <View>
                <Text style={styles.cardTitle}>Worksheet submitted</Text>
                <Text style={styles.cardSite}>
                  <Ionicons name="location-outline" size={13} color={theme.colors.text} />
                  {"  " + todaySheet.siteLocation}
                </Text>
              </View>
              <StatusBadge status={todaySheet.status as any} />
            </View>
            <View style={styles.statsRow}>
              <View style={styles.stat}>
                <Text style={styles.statVal}>{todaySheet.hoursWorked}h</Text>
                <Text style={styles.statLabel}>Hours</Text>
              </View>
              <View style={styles.statDiv} />
              <View style={styles.stat}>
                <Ionicons name="checkmark-circle" size={20} color={
                  todaySheet.status === "reviewed" ? theme.colors.success : theme.colors.warning
                } />
                <Text style={styles.statLabel}>{todaySheet.status === "reviewed" ? "Reviewed" : "Pending"}</Text>
              </View>
            </View>
            {todaySheet.hrRemark && (
              <View style={styles.remarkBox}>
                <Text style={styles.remarkLabel}>HR Remark</Text>
                <Text style={styles.remarkText}>{todaySheet.hrRemark}</Text>
              </View>
            )}
          </Card>
        ) : (
          <TouchableOpacity
            style={styles.emptyCard}
            onPress={() => router.push("/(tabs)/worksheet")}
            activeOpacity={0.8}
          >
            <Ionicons name="add-circle-outline" size={36} color={theme.colors.textSoft} />
            <Text style={styles.emptyTitle}>No worksheet yet today</Text>
            <Text style={styles.emptySub}>Tap to fill your daily report</Text>
          </TouchableOpacity>
        )}

        {/* Quick actions */}
        <Text style={styles.sectionLabel}>Quick actions</Text>
        <View style={styles.actionsGrid}>
          <TouchableOpacity style={styles.actionBtn} onPress={() => router.push("/(tabs)/worksheet")}>
            <View style={[styles.actionIcon, { backgroundColor: "#FFF0F0" }]}>
              <Ionicons name="create-outline" size={22} color={theme.colors.textSoft} />
            </View>
            <Text style={styles.actionLabel}>Fill worksheet</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={() => router.push("/(tabs)/history")}>
            <View style={[styles.actionIcon, { backgroundColor: "#EBF5FB" }]}>
              <Ionicons name="time-outline" size={22} color={theme.colors.onPrimary} />
            </View>
            <Text style={styles.actionLabel}>View history</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={() => router.push("/(tabs)/profile")}>
            <View style={[styles.actionIcon, { backgroundColor: Colors.successBg }]}>
              <Ionicons name="person-outline" size={22} color={Colors.success} />
            </View>
            <Text style={styles.actionLabel}>My profile</Text>
          </TouchableOpacity>
        </View>

        {/* Recent history preview */}
        {/* {recentSheets && recentSheets.length > 0 && (
          <>
            <View style={styles.rowBetween}>
              <Text style={styles.sectionLabel}>Recent worksheets</Text>
              <TouchableOpacity onPress={() => router.push("/(tabs)/history")}>
                <Text style={styles.seeAll}>See all</Text>
              </TouchableOpacity>
            </View>
            {recentSheets.slice(0, 3).map((sheet) => (
              <Card key={sheet._id} style={styles.historyCard}>
                <View style={styles.cardRow}>
                  <View>
                    <Text style={styles.histDate}>
                      {new Date(sheet.date).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })}
                    </Text>
                    <Text style={styles.histSite}>{sheet.siteLocation}</Text>
                  </View>
                  <View style={{ alignItems: "flex-end", gap: 4 }}>
                    <StatusBadge status={sheet.status as any} />
                    <Text style={styles.histHours}>{sheet.hoursWorked}h</Text>
                  </View>
                </View>
              </Card>
            ))}
          </>
        )} */}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  scroll: { padding: 20, paddingBottom: 40 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 },
  greeting: { fontSize: 14, color: Colors.textSoft },
  name: { fontSize: 26, fontWeight: "700", color: Colors.text, letterSpacing: -0.5 },
  dept: { fontSize: 13, color: Colors.textMuted, marginTop: 2 },
  avatarWrap: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: Colors.accent, alignItems: "center", justifyContent: "center",
  },
  avatarText: { color: "#fff", fontWeight: "700", fontSize: 15 },
  sectionLabel: { fontSize: 12, fontWeight: "600", color: Colors.textSoft, letterSpacing: 0.5, marginBottom: 10, marginTop: 4, textTransform: "uppercase" },
  rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 4 },
  seeAll: { fontSize: 13, color: Colors.accent, fontWeight: "500" },
  todayCard: { marginBottom: 20 },
  emptyCard: {
    backgroundColor: Colors.card, borderRadius: 16, borderWidth: 1.5,
    borderColor: Colors.accent, borderStyle: "dashed",
    padding: 32, alignItems: "center", marginBottom: 20,
  },
  emptyTitle: { fontSize: 16, fontWeight: "600", color: Colors.text, marginTop: 10 },
  emptySub: { fontSize: 13, color: Colors.textSoft, marginTop: 4 },
  cardRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 },
  cardTitle: { fontSize: 15, fontWeight: "600", color: Colors.text },
  cardSite: { fontSize: 13, color: Colors.textSoft, marginTop: 3 },
  statsRow: { flexDirection: "row", paddingTop: 12, borderTopWidth: 0.5, borderTopColor: Colors.border },
  stat: { flex: 1, alignItems: "center", gap: 4 },
  statVal: { fontSize: 20, fontWeight: "700", color: Colors.text },
  statLabel: { fontSize: 12, color: Colors.textSoft },
  statDiv: { width: 0.5, backgroundColor: Colors.border, marginHorizontal: 8 },
  remarkBox: { marginTop: 12, backgroundColor: Colors.successBg, borderRadius: 10, padding: 12 },
  remarkLabel: { fontSize: 11, fontWeight: "600", color: Colors.success, marginBottom: 4 },
  remarkText: { fontSize: 13, color: Colors.text, lineHeight: 18 },
  actionsGrid: { flexDirection: "row", gap: 10, marginBottom: 20 },
  actionBtn: { flex: 1, backgroundColor: Colors.card, borderRadius: 14, padding: 14, alignItems: "center", gap: 8, borderWidth: 0.5, borderColor: Colors.border },
  actionIcon: { width: 44, height: 44, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  actionLabel: { fontSize: 12, fontWeight: "500", textAlign: "center" },
  // historyCard: { marginBottom: 10, padding: 14 },
  // histDate: { fontSize: 13, fontWeight: "600", color: Colors.text },
  // histSite: { fontSize: 12, color: Colors.textSoft, marginTop: 2 },
  // histHours: { fontSize: 12, color: Colors.textSoft },
});
