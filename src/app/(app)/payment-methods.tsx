import { View } from "react-native";
import { useRouter } from "expo-router";
import { Icon, type IconName } from "@/components/icons";
import { Button, Divider, Pressy, Radio, Screen, T, styles } from "@/components/ui";
import type { Card } from "@/data";
import { useApp } from "@/store";
import { color } from "@/theme";

const ICON: Record<Card["kind"], IconName> = { card: "card", apple: "apple", paypal: "paypal", google: "playStore" };

export default function PaymentMethods() {
  const router = useRouter();
  const [{ cards, cardId }, dispatch] = useApp();
  return (
    <Screen title="Payment Methods" footer={<Button label="Add New Card" tone="soft" style={{ alignSelf: "center" }} onPress={() => router.push("/card-new")} />}>
      {cards.map((c) => (
        <Pressy key={c.id} accessibilityRole="radio" accessibilityState={{ checked: c.id === cardId }} accessibilityLabel={c.last4 ? `${c.label} ending ${c.last4}` : c.label} onPress={() => dispatch({ type: "selectCard", id: c.id })}>
          <View style={[styles.row, { gap: 16, paddingVertical: 18 }]}>
            <Icon name={ICON[c.kind]} size={28} color={color.red} />
            <T v="h3" style={{ flex: 1 }}>
              {c.last4 ? `•••• •••• •••• ${c.last4}` : c.label}
            </T>
            <Radio on={c.id === cardId} />
          </View>
          <Divider />
        </Pressy>
      ))}
    </Screen>
  );
}
