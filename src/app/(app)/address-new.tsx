import { useState } from "react";
import { KeyboardAvoidingView, Platform, View } from "react-native";
import { useRouter } from "expo-router";
import { Icon } from "@/components/icons";
import { Button, Field, Screen, T } from "@/components/ui";
import { useApp } from "@/store";
import { color } from "@/theme";

export default function AddressNew() {
  const router = useRouter();
  const [, dispatch] = useApp();
  const [label, setLabel] = useState("");
  const [line, setLine] = useState("");
  const [error, setError] = useState("");
  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <Screen
        title="Add New Address"
        footer={
          <Button
            label="Save Address"
            style={{ alignSelf: "center", minWidth: 200 }}
            onPress={() => {
              if (!label.trim() || line.trim().length < 6) return setError("Add a name and a full street address.");
              dispatch({ type: "addAddress", address: { id: `a-${Date.now()}`, label: label.trim(), line: line.trim() } });
              router.back();
            }}
          />
        }
      >
        <View style={{ alignItems: "center", marginBottom: 24 }}>
          <Icon name="home" size={72} color={color.red} />
        </View>
        <Field label="Name" placeholder="Home, Office, Anna's place" value={label} onChangeText={setLabel} />
        <Field label="Address" placeholder="Street, city, state" multiline value={line} onChangeText={setLine} autoComplete="street-address" style={{ minHeight: 70, textAlignVertical: "top" }} />
        {error ? (
          <T v="small" c={color.redText} accessibilityLiveRegion="assertive">
            {error}
          </T>
        ) : null}
      </Screen>
    </KeyboardAvoidingView>
  );
}
