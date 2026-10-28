import { View } from "react-native";
import { useRouter } from "expo-router";
import { StatusScreen } from "@/components/status-screen";
import { Button } from "@/components/ui";

export default function OrderCancelled() {
  const router = useRouter();
  return (
    <StatusScreen icon="xCircle" title="Order Cancelled" body="Your order has been cancelled. Any payment will be refunded within 3–5 business days." note="Questions about a refund? Reach our customer support from the Support tab.">
      <View style={{ gap: 10, marginTop: 28, alignSelf: "stretch" }}>
        <Button label="Back to my orders" onPress={() => router.replace("/orders")} />
        <Button label="Browse the menu" tone="cream" onPress={() => router.replace("/menu")} />
      </View>
    </StatusScreen>
  );
}
