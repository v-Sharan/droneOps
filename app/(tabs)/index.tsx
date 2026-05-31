import { Card, StatusBadge } from "@/components";
import { Text, View } from "@/components/Themed";
import { api } from "@/convex/_generated/api";
import { useAnimatedTheme } from "@/hooks/useAnimateTheme";
import { useTheme } from "@/providers/ThemeContextProvider";
import { useUser } from "@clerk/expo";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "convex/react";
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

  const { user: Curr } = useUser();

  const user = useQuery(
    api.user.getUserByClerkId,
    Curr ? { clerkId: Curr?.id } : "skip"
  );

  const department = useQuery(
    api.departments.getDepartmentById,
    user ? { id: user.departmentId! } : "skip"
  )

  const today = new Date().toISOString().split("T")[0];

  const todaySheet = useQuery(
    api.worksheets.getByUserAndDate,
    user ? { userId: user._id, date: today } : "skip"
  );

  const recentSheets = useQuery(api.worksheets.getByUser, user ? { id: user._id } : "skip");

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  const [refreshing, setRefreshing] = React.useState(false);

  const { colors: Colors } = useAnimatedTheme();

  const { theme } = useTheme()

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.background }]}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => setRefreshing(false)} />}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: Colors.textSoft }]}>{greeting()},</Text>
            <Text style={[styles.name, { color: Colors.text }]}>{user?.name?.split(" ")[0] ?? "—"}</Text>
            <Text style={[styles.dept, { color: Colors.textSecondary }]}>{department?.name} · {user?.employeeId}</Text>
          </View>
          <TouchableOpacity style={[styles.avatarWrap, { backgroundColor: theme.colors.surface }]}>
            <Text style={styles.avatarText}>
              {(user?.name ?? "U").split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Today's worksheet card */}
        <Text style={[styles.sectionLabel, { color: Colors.textSoft }]}>Today — {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "short" })}</Text>

        {todaySheet ? (
          <Card style={styles.todayCard} elevated>
            <View style={styles.cardRow} backgroundColor={Colors.surface}>
              <View backgroundColor={Colors.surface}>
                <Text style={[styles.cardTitle, { color: Colors.text }]}>Worksheet submitted</Text>
                <Text style={[styles.cardSite, { color: Colors.textSoft }]}>
                  <Ionicons name="location-outline" size={13} color={theme.colors.text} />
                  {"  " + todaySheet.siteLocation}
                </Text>
              </View>
              <StatusBadge status={todaySheet.status as any} />
            </View>
            <View style={[styles.statsRow, { borderTopColor: Colors.border }]} backgroundColor={Colors.surface}>
              <View style={styles.stat} backgroundColor={Colors.surface}>
                <Text style={[styles.statVal, { color: Colors.text }]}>{todaySheet.hoursWorked}h</Text>
                <Text style={[styles.statLabel, { color: Colors.textSoft }]}>Hours</Text>
              </View>
              <View style={[styles.statDiv, { backgroundColor: Colors.border }]} />
              <View style={styles.stat} backgroundColor={Colors.surface}>
                <Ionicons name="checkmark-circle" size={20} color={
                  todaySheet.status === "reviewed" ? theme.colors.success : theme.colors.warning
                } />
                <Text style={[styles.statLabel, { color: Colors.textSoft }]}>{todaySheet.status === "reviewed" ? "Reviewed" : "Pending"}</Text>
              </View>
            </View>
          </Card>
        ) : (
          <TouchableOpacity
            style={[styles.emptyCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
            onPress={() => router.push("/(tabs)/worksheet")}
            activeOpacity={0.8}
          >
            <Ionicons name="add-circle-outline" size={36} color={theme.colors.textSoft} />
            <Text style={[styles.emptyTitle, { color: Colors.text }]}>No worksheet yet today</Text>
            <Text style={[styles.emptySub, { color: Colors.textSoft }]}>Tap to fill your daily report</Text>
          </TouchableOpacity>
        )}

        {/* Quick actions */}
        <Text style={styles.sectionLabel}>Quick actions</Text>
        <View style={styles.actionsGrid}>
          <TouchableOpacity style={[styles.actionBtn, { backgroundColor: theme.colors.surfaceRaised, borderColor: theme.colors.border }]} onPress={() => router.push("/(tabs)/worksheet")}>
            <View style={[styles.actionIcon]} backgroundColor={Colors.border}>
              <Ionicons name="create-outline" size={22} color={theme.colors.text} />
            </View>
            <Text style={styles.actionLabel}>Fill worksheet</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionBtn, { backgroundColor: theme.colors.surfaceRaised, borderColor: theme.colors.border }]} onPress={() => router.push("/(tabs)/history")}>
            <View style={[styles.actionIcon]} backgroundColor={Colors.warningBg}>
              <Ionicons name="time-outline" size={22} color={theme.colors.warning} />
            </View>
            <Text style={styles.actionLabel}>View history</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionBtn, { backgroundColor: theme.colors.surfaceRaised, borderColor: theme.colors.border }]} onPress={() => router.push("/(tabs)/profile")}>
            <View style={[styles.actionIcon, { backgroundColor: Colors.successBg }]}>
              <Ionicons name="person-outline" size={22} color={theme.colors.success} />
            </View>
            <Text style={styles.actionLabel}>My profile</Text>
          </TouchableOpacity>
        </View>

        {/* Recent history preview */}
        {recentSheets && recentSheets.length > 0 && (
          <>
            <View style={styles.rowBetween}>
              <Text style={styles.sectionLabel}>Recent worksheets</Text>
              <TouchableOpacity onPress={() => router.push("/(tabs)/history")}>
                <Text style={[styles.seeAll, { color: Colors.textSoft }]}>See all</Text>
              </TouchableOpacity>
            </View>
            {recentSheets.slice(0, 3).map((sheet) => (
              <Card key={sheet._id} style={styles.historyCard}>
                <View style={styles.cardRow} backgroundColor={Colors.surface}>
                  <View backgroundColor={Colors.surface}>
                    <Text style={[styles.histDate, { color: Colors.text }]}>
                      {new Date(sheet.date).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })}
                    </Text>
                    <Text style={[styles.histSite, { color: Colors.textSoft }]}>{sheet.siteLocation}</Text>
                  </View>
                  <View style={{ alignItems: "flex-end", gap: 4 }} backgroundColor={Colors.surface}>
                    <StatusBadge status={sheet.status as any} />
                    <Text style={[styles.histHours, { color: Colors.textSoft }]}>{sheet.hoursWorked}h</Text>
                  </View>
                </View>
              </Card>
            ))}
          </>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { padding: 20, paddingBottom: 40 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 },
  greeting: { fontSize: 14 },
  name: { fontSize: 26, fontWeight: "700", letterSpacing: -0.5 },
  dept: { fontSize: 13, marginTop: 2 },
  avatarWrap: {
    width: 44, height: 44, borderRadius: 22,
    alignItems: "center", justifyContent: "center",
  },
  avatarText: { color: "#fff", fontWeight: "700", fontSize: 15 },
  sectionLabel: { fontSize: 12, fontWeight: "600", letterSpacing: 0.5, marginBottom: 10, marginTop: 4, textTransform: "uppercase" },
  rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 4 },
  seeAll: { fontSize: 13, fontWeight: "500" },
  todayCard: { marginBottom: 20 },
  emptyCard: {
    borderRadius: 16, borderWidth: 1.5,
    borderStyle: "dashed",
    padding: 32, alignItems: "center", marginBottom: 20,
  },
  emptyTitle: { fontSize: 16, fontWeight: "600", marginTop: 10 },
  emptySub: { fontSize: 13, marginTop: 4 },
  cardRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 },
  cardTitle: { fontSize: 15, fontWeight: "600" },
  cardSite: { fontSize: 13, marginTop: 3 },
  statsRow: { flexDirection: "row", paddingTop: 12, borderTopWidth: 0.5 },
  stat: { flex: 1, alignItems: "center", gap: 4 },
  statVal: { fontSize: 20, fontWeight: "700" },
  statLabel: { fontSize: 12 },
  statDiv: { width: 2, marginHorizontal: 8 },
  remarkBox: { marginTop: 12, borderRadius: 10, padding: 12 },
  remarkLabel: { fontSize: 11, fontWeight: "600", marginBottom: 4 },
  remarkText: { fontSize: 13, lineHeight: 18 },
  actionsGrid: { flexDirection: "row", gap: 10, marginBottom: 20 },
  actionBtn: { flex: 1, borderRadius: 14, padding: 14, alignItems: "center", gap: 8, borderWidth: 0.5 },
  actionIcon: { width: 44, height: 44, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  actionLabel: { fontSize: 12, fontWeight: "500", textAlign: "center" },
  historyCard: { marginBottom: 10, padding: 14 },
  histDate: { fontSize: 13, fontWeight: "600" },
  histSite: { fontSize: 12, marginTop: 2 },
  histHours: { fontSize: 12 },
});
