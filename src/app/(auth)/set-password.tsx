import { useState } from "react";
import { useRouter } from "expo-router";
import { Button, Field, Screen, T } from "@/components/ui";
import { color } from "@/theme";

export default function SetPassword() {
  const router = useRouter();
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [error, setError] = useState("");
  return (
    <Screen title="Set Password">
      <T c={color.inkSoft} style={{ marginBottom: 28 }}>
        Choose a new password with at least 6 characters. You will use it next time you log in.
      </T>
      <Field label="Password" secure autoComplete="new-password" value={a} onChangeText={setA} />
      <Field label="Confirm password" secure autoComplete="new-password" value={b} onChangeText={setB} />
      {error ? (
        <T v="small" c={color.redText} accessibilityLiveRegion="assertive">
          {error}
        </T>
      ) : null}
      <Button
        label="Create New Password"
        style={{ alignSelf: "center", marginTop: 28 }}
        onPress={() => {
          if (a.length < 6) return setError("Use at least 6 characters.");
          if (a !== b) return setError("The two passwords don't match.");
          router.replace("/login");
        }}
      />
    </Screen>
  );
}
