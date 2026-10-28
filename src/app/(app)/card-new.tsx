import { useState } from "react";
import { KeyboardAvoidingView, Platform, View } from "react-native";
import { useRouter } from "expo-router";
import { Button, Field, Screen, T, styles } from "@/components/ui";
import { useApp } from "@/store";
import { color, font, radius } from "@/theme";

const groups = (digits: string) => digits.replace(/\D/g, "").slice(0, 16).replace(/(.{4})(?=.)/g, "$1 ");

export default function CardNew() {
  const router = useRouter();
  const [{ user }, dispatch] = useApp();
  const [holder, setHolder] = useState(user?.name ?? "");
  const [number, setNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [error, setError] = useState("");
  const digits = number.replace(/\D/g, "");

  const save = () => {
    if (!holder.trim()) return setError("Add the name on the card.");
    if (digits.length < 15) return setError("Card numbers are 15 or 16 digits.");
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry)) return setError("Use MM/YY for the expiry date.");
    if (cvv.length < 3) return setError("The CVV is the 3 or 4 digits on the back.");
    dispatch({ type: "addCard", card: { id: `c-${Date.now()}`, kind: "card", label: "Credit card", last4: digits.slice(-4), holder: holder.trim(), expiry } });
    router.back();
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <Screen title="Add Card" footer={<Button label="Save Card" style={{ alignSelf: "center", minWidth: 200 }} onPress={save} />}>
        <View style={{ borderRadius: radius.lg, backgroundColor: color.red, aspectRatio: 1.6, padding: 20, overflow: "hidden", justifyContent: "space-between" }} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
          <View style={{ position: "absolute", right: -60, bottom: -90, width: 260, height: 260, borderRadius: 130, backgroundColor: color.yellow }} />
          <View style={{ alignSelf: "flex-end", width: 44, height: 30, borderRadius: 6, backgroundColor: color.cream }} />
          <T style={{ fontFamily: font.semibold, fontSize: 22, letterSpacing: 1.5 }} c={color.white}>
            {groups(number) || "0000 0000 0000 0000"}
          </T>
          <View style={[styles.row, { justifyContent: "space-between" }]}>
            <View>
              <T v="small" c={color.white}>
                Card holder
              </T>
              <T v="label" c={color.white}>
                {holder || "Your name"}
              </T>
            </View>
            <View>
              <T v="small" c={color.ink}>
                Expires
              </T>
              <T v="label">{expiry || "MM/YY"}</T>
            </View>
          </View>
        </View>
        <View style={{ height: 24 }} />
        <Field label="Card holder name" value={holder} onChangeText={setHolder} autoComplete="cc-name" />
        <Field label="Card number" value={groups(number)} onChangeText={setNumber} keyboardType="number-pad" autoComplete="cc-number" placeholder="0000 0000 0000 0000" />
        <View style={[styles.row, { gap: 16, alignItems: "flex-start" }]}>
          <View style={{ flex: 1 }}>
            <Field
              label="Expiry date"
              value={expiry}
              onChangeText={(t) => {
                const d = t.replace(/\D/g, "").slice(0, 4);
                setExpiry(d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d);
              }}
              keyboardType="number-pad"
              placeholder="MM/YY"
              autoComplete="cc-exp"
            />
          </View>
          <View style={{ flex: 1 }}>
            <Field label="CVV" value={cvv} onChangeText={(t) => setCvv(t.replace(/\D/g, "").slice(0, 4))} keyboardType="number-pad" secure placeholder="000" autoComplete="cc-csc" />
          </View>
        </View>
        {error ? (
          <T v="small" c={color.redText} accessibilityLiveRegion="assertive">
            {error}
          </T>
        ) : null}
      </Screen>
    </KeyboardAvoidingView>
  );
}
