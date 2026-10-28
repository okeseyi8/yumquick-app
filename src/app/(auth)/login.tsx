import { useState } from "react";
import { KeyboardAvoidingView, Platform, View } from "react-native";
import { useRouter } from "expo-router";
import { Button, Field, IconButton, Pressy, Screen, T, styles } from "@/components/ui";
import { useApp } from "@/store";
import { color } from "@/theme";

export default function Login() {
  const router = useRouter();
  const [, dispatch] = useApp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = () => {
    if (!email.trim() || password.length < 6) return setError("Enter your email or mobile number and a password of at least 6 characters.");
    dispatch({ type: "login", email: email.trim() });
    router.replace("/home");
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <Screen title="Log In">
        <T v="h2">Welcome back</T>
        <T c={color.inkSoft} style={{ marginTop: 6, marginBottom: 28 }}>
          Log in to reorder your favorites and track deliveries.
        </T>
        <Field label="Email or mobile number" placeholder="example@example.com" autoCapitalize="none" keyboardType="email-address" autoComplete="email" value={email} onChangeText={setEmail} />
        <Field label="Password" placeholder="At least 6 characters" secure autoComplete="password" value={password} onChangeText={setPassword} onSubmitEditing={submit} />
        <Pressy accessibilityRole="link" style={{ alignSelf: "flex-end", paddingVertical: 6 }} onPress={() => router.push("/set-password")}>
          <T v="small" c={color.redText}>
            Forgot password?
          </T>
        </Pressy>
        {error ? (
          <T v="small" c={color.redText} accessibilityLiveRegion="assertive" style={{ marginTop: 12 }}>
            {error}
          </T>
        ) : null}
        <Button label="Log In" size="lg" style={{ alignSelf: "center", minWidth: 200, marginTop: 32 }} onPress={submit} />
        <T v="small" c={color.inkSoft} style={{ textAlign: "center", marginTop: 20 }}>
          or continue with
        </T>
        <View style={[styles.row, { justifyContent: "center", gap: 12, marginTop: 10 }]}>
          <IconButton name="google" label="Continue with Google" tone="white" size={40} onPress={() => setEmail("john@gmail.com")} />
          <IconButton name="facebook" label="Continue with Facebook" tone="white" size={40} />
          <IconButton name="fingerprint" label="Log in with fingerprint" tone="white" size={40} onPress={() => router.push("/fingerprint")} />
        </View>
        <View style={[styles.row, { justifyContent: "center", marginTop: 24 }]}>
          <T v="small" c={color.inkSoft}>
            New to YumQuick?{" "}
          </T>
          <Pressy accessibilityRole="link" hitSlop={10} onPress={() => router.replace("/signup")}>
            <T v="small" c={color.redText}>
              Sign up
            </T>
          </Pressy>
        </View>
      </Screen>
    </KeyboardAvoidingView>
  );
}
