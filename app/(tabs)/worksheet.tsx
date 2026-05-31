import { Button, Card, Input, StatusBadge } from "@/components";
import { Text, View } from "@/components/Themed";
import { api } from "@/convex/_generated/api";
import { useAnimatedTheme } from "@/hooks/useAnimateTheme";
import { useTheme } from "@/providers/ThemeContextProvider";
import { useUser } from "@clerk/expo";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery } from "convex/react";
import { useEffect, useState } from "react";
import {
    Alert, KeyboardAvoidingView, Platform,
    ScrollView,
    StyleSheet,
    TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function WorksheetScreen() {
  const { user : clerk_user } = useUser();

  const user = useQuery(api.user.getUserByClerkId, clerk_user ? { clerkId: clerk_user?.id! } : "skip");
  const today = new Date().toISOString().split("T")[0];

  const existing = useQuery(
    api.worksheets.getByUserAndDate,
    user ? { userId: user._id, date: today } : "skip"
  );

  const saveDraft = useMutation(api.worksheets.saveDraft);
  const submitWorksheet = useMutation(api.worksheets.submitWorksheet);

  const [tasks, setTasks] = useState("");
  const [site, setSite] = useState("");
  const [hours, setHours] = useState("");
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const {colors:Colors,radii} = useAnimatedTheme();
  const {theme} = useTheme();

  useEffect(() => {
    if (existing) {
      setTasks(existing.tasks ?? "");
      setSite(existing.siteLocation ?? "");
      setHours(String(existing.hoursWorked ?? ""));
    }
  }, [existing?._id]);

  const isReadOnly = existing?.status === "submitted" || existing?.status === "reviewed";

  const validate = () => {
    const e: Record<string, string> = {};
    if (!tasks.trim()) e.tasks = "Please describe your tasks";
    if (!site.trim()) e.site = "Site/location is required";
    const h = parseFloat(hours);
    if (!hours || isNaN(h) || h <= 0 || h > 24) e.hours = "Enter valid hours (0–24)";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate() || !user) return;
    setSaving(true);
    try {
      await saveDraft({
        userId: user._id,
        date: today,
        tasks,
        siteLocation: site,
        hoursWorked: parseFloat(hours),
      });
      Alert.alert("Saved", "Draft saved successfully.");
    } catch (e: any) {
      Alert.alert("Error", e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async () => {
    if (!validate() || !user) return;
    Alert.alert(
      "Submit worksheet",
      "Once submitted, you cannot edit it. Continue?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Submit",
          onPress: async () => {
            setSubmitting(true);
            try {
              let sheetId = existing?._id;
              if (!sheetId || existing?.status === "draft") {
                sheetId = await saveDraft({
                  userId: user._id, date: today, tasks,
                  siteLocation: site, hoursWorked: parseFloat(hours),
                });
              }
              await submitWorksheet({ worksheetId: sheetId! });
              Alert.alert("Submitted!", "Your worksheet has been submitted. HR has been notified.");
            } catch (e: any) {
              Alert.alert("Error", e.message);
            } finally {
              setSubmitting(false);
            }
          },
        },
      ]
    );
  };

  const todayFormatted = new Date().toLocaleDateString("en-IN", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

  return (
    <SafeAreaView style={{flex: 1,backgroundColor: theme.colors.background}}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

          <View style={styles.header}>
            <View>
              <Text style={[styles.title,{color: Colors.text}]}>Daily Worksheet</Text>
              <Text style={[styles.date,{color: Colors.textSoft}]}>{todayFormatted}</Text>
            </View>
            {existing && <StatusBadge status={existing.status as any} />}
          </View>

          {isReadOnly && (
            <View style={[styles.readOnlyBanner,{backgroundColor: Colors.surface, borderRadius: radii.md,}]}>
              <Ionicons name="lock-closed-outline" size={15} color={theme.colors.primary} />
              <Text style={[styles.readOnlyText,{color: Colors.textSecondary}]}>
                {existing?.status === "reviewed"
                  ? "This worksheet has been reviewed by HR"
                  : "Submitted — awaiting HR review"}
              </Text>
            </View>
          )}

          <Card style={styles.card}>
            <View style={styles.fieldGroup}>
                <Text style={[styles.fieldLabel,{color: Colors.textSoft}]}>Tasks completed today *</Text>
                <TextInput
                style={[styles.textarea,{borderColor: theme.colors.border, borderRadius: theme.radii.md,color: theme.colors.text, backgroundColor: theme.colors.surfaceRaised}, errors.tasks ? {borderColor: theme.colors.error} : null, isReadOnly && {backgroundColor: theme.colors.background, color: theme.colors.textSoft}]}
                value={tasks}
                onChangeText={setTasks}
                placeholder="Describe the work you did today..."
                multiline
                numberOfLines={5}
                editable={!isReadOnly}
                textAlignVertical="top"
                placeholderTextColor={theme.colors.textSecondary}
              />
              {errors.tasks && <Text style={[styles.err,{color: Colors.error}]}>{errors.tasks}</Text>}
            </View>

            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <Input
                  label="Site / Location *"
                  value={site}
                  onChangeText={setSite}
                  placeholder="e.g. Tambaram site"
                  editable={!isReadOnly}
                  error={errors.site}
                  containerStyle={{ marginBottom: 0 }}
                />
              </View>
              <View style={{ width: 110 }}>
                <Input
                  label="Hours worked *"
                  value={hours}
                  onChangeText={setHours}
                  placeholder="8"
                  keyboardType="decimal-pad"
                  editable={!isReadOnly}
                  error={errors.hours}
                  containerStyle={{ marginBottom: 0 }}
                />
              </View>
            </View>
          </Card>

          {!isReadOnly && (
            <View style={styles.actions}>
              <Button
                title="Save draft"
                variant="secondary"
                onPress={handleSave}
                loading={saving}
                fullWidth={false}
                style={{ flex: 1 }}
              />
              <Button
                title="Submit to HR"
                onPress={handleSubmit}
                loading={submitting}
                fullWidth={false}
                style={{ flex: 1 }}
              />
            </View>
          )}

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: 20, paddingBottom: 48 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 },
  title: { fontSize: 22, fontWeight: "700" },
  date: { fontSize: 13, marginTop: 2 },
  readOnlyBanner: {
    flexDirection: "row", alignItems: "center", gap: 8,
    padding: 12, marginBottom: 14,
  },
  readOnlyText: { fontSize: 13 },
  card: { marginBottom: 14 },
  fieldGroup: { marginBottom: 16 },
  fieldLabel: { fontSize: 13, fontWeight: "500", marginBottom: 6 },
  textarea: {
    borderWidth: 1,
    padding: 12, fontSize: 14,
    minHeight: 100,
  },
  shortArea: { minHeight: 64 },
  err: { fontSize: 12, marginTop: 4 },
  row: { flexDirection: "row", gap: 12, marginBottom: 16 },
  actions: { flexDirection: "row", gap: 12 },
});
