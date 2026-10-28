import { View } from "react-native";
import { useRouter } from "expo-router";
import { AddressBlock, SectionHead } from "@/components/checkout";
import { Icon } from "@/components/icons";
import { Button, Divider, Screen, T, styles } from "@/components/ui";
import { dishById } from "@/data";
import { money, totals, useApp } from "@/store";
import { color, radius } from "@/theme";

export default function Payment() {
  const router = useRouter();
  const [{ cart, cards, cardId }, dispatch] = useApp();
  const card = cards.find((c) => c.id === cardId)!;
  const t = totals(cart);

  return (
    <Screen
      title="Payment"
      footer={
        <Button
          label={`Pay ${money(t.total)}`}
          size="lg"
          disabled={!cart.length}
          style={{ alignSelf: "center", minWidth: 200 }}
          onPress={() => {
            dispatch({ type: "placeOrder" });
            router.replace("/order-confirmed");
          }}
        />
      }
    >
      <AddressBlock />
      <SectionHead title="Order Summary" action="Edit" onAction={() => router.back()} />
      <View style={[styles.row, { alignItems: "flex-start" }]}>
        <View style={{ flex: 1, gap: 2 }}>
          {cart.map((l) => (
            <T key={l.key} v="small" c={color.inkSoft}>
              {dishById(l.dishId)!.name} <T v="small" c={color.redText}>× {l.qty}</T>
            </T>
          ))}
        </View>
        <T v="h2">{money(t.total)}</T>
      </View>
      <Divider style={{ marginTop: 16 }} />
      <SectionHead title="Payment Method" action="Edit" onAction={() => router.push("/payment-methods")} />
      <View style={[styles.row, { gap: 10, marginTop: 4 }]}>
        <Icon name={card.kind === "card" ? "card" : card.kind === "apple" ? "apple" : card.kind === "paypal" ? "paypal" : "playStore"} size={24} color={color.red} />
        <T style={{ flex: 1 }}>{card.label}</T>
        {card.last4 ? (
          <View style={{ backgroundColor: color.cream, borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 3 }}>
            <T v="small">•••• {card.last4}</T>
          </View>
        ) : null}
      </View>
      <Divider style={{ marginTop: 16 }} />
      <SectionHead title="Delivery Time" />
      <View style={[styles.row, { justifyContent: "space-between" }]}>
        <T v="small" c={color.inkSoft}>
          Estimated delivery
        </T>
        <T v="h3" c={color.redText}>
          25 mins
        </T>
      </View>
    </Screen>
  );
}
