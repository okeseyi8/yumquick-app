import { useState } from "react";
import { KeyboardAvoidingView, Platform, View } from "react-native";
import { Icon } from "@/components/icons";
import { Button, Field, Screen, T, styles } from "@/components/ui";
import { useApp } from "@/store";
import { color, font, radius } from "@/theme";

export default function Profile() {
  const [{ user }, dispatch] = useApp();
  const [f, setF] = useState(user ?? { name: "", email: "", phone: "", dob: "" });
  const [saved, setSaved] = useState(false);
  const set = (k: keyof typeof f) => (v: string) => {
    setSaved(false);
    setF({ ...f, [k]: v });
  };
  const initials = f.name.split(" ").map((p) => p[0]).slice(0, 2).join("") || "?";

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <Screen title="My Profile">
        <View style={{ alignItems: "center", marginBottom: 20 }}>
          <View style={[styles.center, { width: 110, height: 110, borderRadius: radius.lg, backgroundColor: color.yellow }]}>
            <T style={{ fontFamily: font.bold, fontSize: 40, lineHeight: 44 }} c={color.redDeep}>
              {initials}
            </T>
            <View style={[styles.center, { position: "absolute", right: -6, bottom: -6, width: 30, height: 30, borderRadius: 15, backgroundColor: color.red }]}>
              <Icon name="camera" size={16} color={color.white} />
            </View>
          </View>
        </View>
        <Field label="Full name" value={f.name} onChangeText={set("name")} autoComplete="name" />
        <Field label="Date of birth" value={f.dob} onChangeText={set("dob")} placeholder="DD / MM / YYYY" keyboardType="number-pad" />
        <Field label="Email" value={f.email} onChangeText={set("email")} keyboardType="email-address" autoCapitalize="none" autoComplete="email" />
        <Field label="Phone number" value={f.phone} onChangeText={set("phone")} keyboardType="phone-pad" autoComplete="tel" />
        <Button
          label={saved ? "Saved" : "Update Profile"}
          icon={saved ? "checkCircle" : undefined}
          style={{ alignSelf: "center", minWidth: 200, marginTop: 12 }}
          onPress={() => {
            dispatch({ type: "updateUser", user: f });
            setSaved(true);
          }}
        />
      </Screen>
    </KeyboardAvoidingView>
  );
}
