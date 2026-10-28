import { View } from "react-native";
import { useRouter } from "expo-router";
import { eta } from "@/components/checkout";
import { StatusScreen } from "@/components/status-screen";
import { Button, T } from "@/components/ui";
import { useApp } from "@/store";

export default function OrderConfirmed() {
  const router = useRouter();
  const [{ orders }] = useApp();
  const order = orders.find((o) => o.status === "active");
  return (
    <StatusScreen icon="checkCircle" title="Order Confirmed!" body="Your order has been placed and the kitchen is on it." note="Questions about your order? Reach our customer support from the Support tab.">
      {order ? (
        <T v="h3" style={{ marginTop: 22, textAlign: "center" }}>
          Arriving by {eta(order.placedAt)}
        </T>
      ) : null}
      <View style={{ gap: 10, marginTop: 28, alignSelf: "stretch" }}>
        <Button label="Track my order" onPress={() => router.replace(order ? `/delivery-time?id=${order.id}` : "/orders")} />
        <Button label="Back to home" tone="cream" onPress={() => router.replace("/home")} />
      </View>
    </StatusScreen>
  );
}
