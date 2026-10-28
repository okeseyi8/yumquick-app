import { useState } from "react";
import { KeyboardAvoidingView, Platform, View } from "react-native";
import { useRouter } from "expo-router";
import { Button, Field, Pressy, Screen, T, styles } from "@/components/ui";
import { useApp } from "@/store";
import { color } from "@/theme";

export default function Signup() {
  const router = useRouter();
  const [, dispatch] = useApp();
  const [f, setF] = useState({ name: "", password: "", email: "", phone: "", dob: "" });
  const [error, setError] = useState("");
  const set = (k: keyof typeof f) => (v: string) => setF({ ...f, [k]: v });

  const submit = () => {
    if (!f.name.trim()) return setError("Add your full name.");
    if (!/^\S+@\S+\.\S+$/.test(f.email)) return setError("That email doesn't look right.");
    if (f.password.length < 6) return setError("Use at least 6 characters for your password.");
    dispatch({ type: "login", name: f.name.trim(), email: f.email.trim(), phone: f.phone, dob: f.dob });
    router.replace("/fingerprint");
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <Screen title="New Account">
        <Field label="Full name" placeholder="John Smith" autoComplete="name" value={f.name} onChangeText={set("name")} />
        <Field label="Password" placeholder="At least 6 characters" secure autoComplete="new-password" value={f.password} onChangeText={set("password")} />
        <Field label="Email" placeholder="example@example.com" autoCapitalize="none" keyboardType="email-address" autoComplete="email" value={f.email} onChangeText={set("email")} />
        <Field label="Mobile number" placeholder="+1 510 555 0199" keyboardType="phone-pad" autoComplete="tel" value={f.phone} onChangeText={set("phone")} />
        <Field label="Date of birth" placeholder="DD / MM / YYYY" keyboardType="number-pad" maxLength={10} value={f.dob} onChangeText={set("dob")} />
        <T v="small" c={color.inkSoft} style={{ textAlign: "center", marginTop: 4 }}>
          By continuing, you agree to our <T v="small" c={color.redText}>Terms of Use</T> and <T v="small" c={color.redText}>Privacy Policy</T>.
        </T>
        {error ? (
          <T v="small" c={color.redText} accessibilityLiveRegion="assertive" style={{ marginTop: 12, textAlign: "center" }}>
            {error}
          </T>
        ) : null}
        <Button label="Sign Up" size="lg" style={{ alignSelf: "center", minWidth: 200, marginTop: 20 }} onPress={submit} />
        <View style={[styles.row, { justifyContent: "center", marginTop: 20 }]}>
          <T v="small" c={color.inkSoft}>
            Already have an account?{" "}
          </T>
          <Pressy accessibilityRole="link" hitSlop={10} onPress={() => router.replace("/login")}>
            <T v="small" c={color.redText}>
              Log in
            </T>
          </Pressy>
        </View>
      </Screen>
    </KeyboardAvoidingView>
  );
}
