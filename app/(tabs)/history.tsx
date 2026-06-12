import { Card, StatusBadge } from "@/components";
import { Text, View } from "@/components/Themed";
import { api } from "@/convex/_generated/api";
import { useAnimatedTheme } from "@/hooks/useAnimateTheme";
import { useTheme } from "@/providers/ThemeContextProvider";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "convex/react";
import { useState } from "react";
import {
  RefreshControl,
  ScrollView,
  StyleSheet
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HistoryScreen() {
  const [refreshing, setRefreshing] = useState(false);

  const {colors: Colors,radii} = useAnimatedTheme();
  const { theme } = useTheme();

  const sheets = useQuery(api.worksheets.getByUser);

  return (
    <SafeAreaView style={[styles.safe,{backgroundColor: theme.colors.background}]}>
      <View style={styles.header}>
        <Text style={[styles.title,{color: Colors.text}]}>Worksheet History</Text>
        <Text style={[styles.sub,{color: Colors.textSoft}]}>{sheets?.length ?? 0} entries</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => setRefreshing(false)} />
        }
      >
        {!sheets || sheets.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons name="document-outline" size={48} color={theme.colors.textSecondary} />
            <Text style={[styles.emptyTitle,{color: Colors.textSoft}]}>No worksheets yet</Text>
            <Text style={[styles.emptySub,{color: Colors.textSoft}]}>Your submitted worksheets will appear here</Text>
          </View>
        ) : (
          sheets.map((sheet) => (
            <Card key={sheet._id} style={styles.card} elevated>
              <View style={styles.cardTop} backgroundColor={Colors.surface}>
                <View style={[styles.dateBlock]} backgroundColor={Colors.surface}>
                  <Text style={[styles.dayNum,{color: Colors.textSoft}]}>
                    {new Date(sheet.date).toLocaleDateString("en-IN", { day: "numeric" })}
                  </Text>
                  <Text style={[styles.monthYear,{color: Colors.textSoft}]}>
                    {new Date(sheet.date).toLocaleDateString("en-IN", { month: "short", year: "2-digit" })}
                  </Text>
                </View>
                <View style={styles.cardMain} backgroundColor={Colors.surface}>
                  <View style={styles.cardRow} backgroundColor={Colors.surface}>
                    <Text style={[styles.weekday,{ color: Colors.text}]}>
                      {new Date(sheet.date).toLocaleDateString("en-IN", { weekday: "long" })}
                    </Text>
                    <StatusBadge status={sheet.status as any} />
                  </View>
                  <View style={styles.metaRow} backgroundColor={Colors.surface}>
                    <Ionicons name="location-outline" size={13} color={theme.colors.textSoft} />
                    <Text style={[styles.metaText,{color: Colors.textSoft}]}>{sheet.siteLocation}</Text>
                    <View style={[styles.dot,{backgroundColor: Colors.textSoft}]} />
                    <Ionicons name="time-outline" size={13} color={theme.colors.textSoft} />
                    <Text style={[styles.metaText,{color: Colors.textSoft}]}>{sheet.hoursWorked}h</Text>
                  </View>
                  <Text style={[styles.tasks,{color: Colors.textSoft}]} numberOfLines={2}>{sheet.tasks}</Text>
                </View>
              </View>
            </Card>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: { padding: 20, paddingBottom: 10 },
  title: { fontSize: 22, fontWeight: "700" },
  sub: { fontSize: 13, marginTop: 2 },
  scroll: { padding: 20, paddingTop: 10, paddingBottom: 40 },
  empty: { alignItems: "center", paddingTop: 80, gap: 10 },
  emptyTitle: { fontSize: 16, fontWeight: "600" },
  emptySub: { fontSize: 13, textAlign: "center" },
  card: { marginBottom: 12, padding: 14 },
  cardTop: { flexDirection: "row", gap: 14 },
  dateBlock: {
    width: 44, alignItems: "center", justifyContent: "center",
     padding: 8,
  },
  dayNum: { fontSize: 20, fontWeight: "700" },
  monthYear: { fontSize: 11, fontWeight: "500" },
  cardMain: { flex: 1 },
  cardRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 4 },
  weekday: { fontSize: 14, fontWeight: "600" },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 4, marginBottom: 6 },
  metaText: { fontSize: 12 },
  dot: { width: 3, height: 3, borderRadius: 1.5, marginHorizontal: 2 },
  tasks: { fontSize: 13, lineHeight: 18 },
});
