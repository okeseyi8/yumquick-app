import { useEffect, useState } from "react";
import { View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { AddressBlock } from "@/components/checkout";
import { RouteMap } from "@/components/route-map";
import { Button, Divider, Screen, T, styles } from "@/components/ui";
import { useApp } from "@/store";
import { color } from "@/theme";

const STEPS = [
  { label: "Your order has been accepted", mins: 2 },
  { label: "The restaurant is preparing your order", mins: 7 },
  { label: "The courier is on the way", mins: 17 },
  { label: "Your order has been delivered", mins: 25 },
];

export default function DeliveryTime() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const [{ orders }] = useApp();
  const order = orders.find((o) => o.id === id) ?? orders.find((o) => o.status === "active");
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(t);
  }, []);
  const elapsed = order ? (now - order.placedAt) / 60_000 : 0;
  const left = Math.max(0, Math.ceil(25 - elapsed));

  return (
    <Screen
      title="Delivery Time"
      footer={
        <View style={[styles.row, { gap: 12 }]}>
          <Button label="Home" tone="soft" style={{ flex: 1 }} onPress={() => router.replace("/home")} />
          <Button label="My Orders" style={{ flex: 1 }} onPress={() => router.replace("/orders")} />
        </View>
      }
    >
      <AddressBlock editable={false} />
      <View style={{ marginTop: 18 }}>
        <RouteMap progress={(elapsed - 7) / 18} />
      </View>
      <View style={[styles.row, { justifyContent: "space-between", marginTop: 20 }]}>
        <View>
          <T v="h2">Delivery Time</T>
          <T v="small" c={color.inkSoft}>
            Estimated delivery
          </T>
        </View>
        <T v="title" c={color.redText}>
          {order ? `${left} mins` : "—"}
        </T>
      </View>
      <Divider style={{ marginVertical: 14 }} />
      {STEPS.map((s, i) => {
        const done = elapsed >= s.mins;
        const current = !done && (i === 0 || elapsed >= STEPS[i - 1].mins);
        return (
          <View key={s.label} style={[styles.row, { gap: 12, paddingVertical: 8 }]} accessibilityLabel={`${s.label}${done ? ", done" : current ? ", in progress" : ""}`}>
            <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: done || current ? color.red : color.track }} />
            <T style={{ flex: 1 }} c={done || current ? color.ink : color.inkSoft}>
              {s.label}
            </T>
            <T v="small" c={color.inkSoft}>
              {s.mins} min
            </T>
          </View>
        );
      })}
    </Screen>
  );
}
