import { useState } from "react";
import { TextInput, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Button, Divider, Pressy, Radio, Screen, T, styles } from "@/components/ui";
import { cancelReasons } from "@/data";
import { useApp } from "@/store";
import { color, font, radius } from "@/theme";

export default function CancelOrder() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [, dispatch] = useApp();
  const [reason, setReason] = useState<string | null>(null);
  const [other, setOther] = useState("");
  const ready = reason !== null || other.trim().length > 0;

  return (
    <Screen
      title="Cancel Order"
      footer={
        <Button
          label="Cancel order"
          size="lg"
          disabled={!ready}
          style={{ alignSelf: "center", minWidth: 200 }}
          onPress={() => {
            dispatch({ type: "setOrderStatus", id, status: "cancelled" });
            router.replace("/order-cancelled");
          }}
        />
      }
    >
      <T c={color.inkSoft} style={{ marginBottom: 12 }}>
        Tell us why you’re cancelling. It helps us and the restaurant get it right next time.
      </T>
      {cancelReasons.map((r) => (
        <Pressy key={r} accessibilityRole="radio" accessibilityState={{ checked: reason === r }} onPress={() => setReason(r)}>
          <Divider />
          <View style={[styles.row, { paddingVertical: 16, gap: 12 }]}>
            <T style={{ flex: 1 }}>{r}</T>
            <Radio on={reason === r} />
          </View>
        </Pressy>
      ))}
      <Divider />
      <T v="h3" style={{ marginTop: 20, marginBottom: 8 }}>
        Something else
      </T>
      <TextInput
        multiline
        value={other}
        onChangeText={(t) => {
          setOther(t);
          if (t) setReason(null);
        }}
        placeholder="Tell us more"
        placeholderTextColor={color.inkSoft}
        accessibilityLabel="Other reason"
        style={{ minHeight: 100, backgroundColor: color.cream, borderRadius: radius.md, padding: 14, fontFamily: font.regular, fontSize: 16, color: color.ink, textAlignVertical: "top" }}
      />
    </Screen>
  );
}
