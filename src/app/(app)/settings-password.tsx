import { useState } from "react";
import { KeyboardAvoidingView, Platform } from "react-native";
import { useRouter } from "expo-router";
import { Button, Field, Pressy, Screen, T } from "@/components/ui";
import { color } from "@/theme";

export default function PasswordSettings() {
  const router = useRouter();
  const [cur, setCur] = useState("");
  const [next, setNext] = useState("");
  const [again, setAgain] = useState("");
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const submit = () => {
    if (!cur) return setMsg({ ok: false, text: "Enter your current password." });
    if (next.length < 6) return setMsg({ ok: false, text: "Use at least 6 characters for the new password." });
    if (next !== again) return setMsg({ ok: false, text: "The new passwords don't match." });
    setCur("");
    setNext("");
    setAgain("");
    setMsg({ ok: true, text: "Password changed." });
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <Screen title="Password" footer={<Button label="Change Password" style={{ alignSelf: "center", minWidth: 200 }} onPress={submit} />}>
        <Field label="Current password" secure value={cur} onChangeText={setCur} autoComplete="current-password" />
        <Pressy accessibilityRole="link" hitSlop={10} style={{ alignSelf: "flex-end", marginTop: -8, marginBottom: 16 }} onPress={() => router.push("/set-password")}>
          <T v="small" c={color.redText}>
            Forgot password?
          </T>
        </Pressy>
        <Field label="New password" secure value={next} onChangeText={setNext} autoComplete="new-password" />
        <Field label="Confirm new password" secure value={again} onChangeText={setAgain} autoComplete="new-password" />
        {msg ? (
          <T v="small" c={msg.ok ? color.ink : color.redText} accessibilityLiveRegion="polite">
            {msg.text}
          </T>
        ) : null}
      </Screen>
    </KeyboardAvoidingView>
  );
}
