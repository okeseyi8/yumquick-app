import { View } from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import Animated, { FadeOut, LinearTransition } from "react-native-reanimated";
import { AddressBlock, SectionHead, Totals } from "@/components/checkout";
import { Icon } from "@/components/icons";
import { Button, Divider, Empty, Pressy, Screen, Stepper, T, styles } from "@/components/ui";
import { dishById } from "@/data";
import { money, useApp } from "@/store";
import { color, radius } from "@/theme";

export default function ConfirmOrder() {
  const router = useRouter();
  const [{ cart }, dispatch] = useApp();

  if (!cart.length) {
    return (
      <Screen title="Confirm Order">
        <Empty icon="cart" title="Your cart is empty" body="Add a dish or two and come back to check out." action={<Button label="Browse the menu" size="sm" onPress={() => router.push("/menu")} />} />
      </Screen>
    );
  }

  return (
    <Screen title="Confirm Order" footer={<Button label="Place Order" size="lg" style={{ alignSelf: "center", minWidth: 200 }} onPress={() => router.push("/payment")} />}>
      <AddressBlock />
      <SectionHead title="Order Summary" action="Edit" onAction={() => dispatch({ type: "drawer", drawer: "cart" })} />
      {cart.map((l) => {
        const dish = dishById(l.dishId)!;
        return (
          <Animated.View key={l.key} exiting={FadeOut.duration(180)} layout={LinearTransition.duration(240)}>
            <View style={[styles.row, { gap: 14, paddingVertical: 14 }]}>
              <Image source={dish.image} style={{ width: 72, height: 96, borderRadius: radius.md }} contentFit="cover" />
              <View style={{ flex: 1, gap: 4 }}>
                <View style={[styles.row, { justifyContent: "space-between", gap: 8 }]}>
                  <T v="h3" numberOfLines={2} style={{ flex: 1 }}>
                    {dish.name}
                  </T>
                  <T v="h3" c={color.redText}>
                    {money(l.unit * l.qty)}
                  </T>
                </View>
                <T v="small" c={color.inkSoft} numberOfLines={1}>
                  {l.addOns.length ? `+ ${dish.addOns.filter((a) => l.addOns.includes(a.id)).map((a) => a.name).join(", ")}` : dish.blurb}
                </T>
                <View style={[styles.row, { justifyContent: "space-between", marginTop: 6 }]}>
                  <Pressy accessibilityRole="button" accessibilityLabel={`Remove ${dish.name}`} hitSlop={12} onPress={() => dispatch({ type: "remove", key: l.key })} style={[styles.row, { gap: 4 }]}>
                    <Icon name="trash" size={14} color={color.redText} />
                    <T v="small" c={color.redText}>
                      Remove
                    </T>
                  </Pressy>
                  <Stepper qty={l.qty} onChange={(d) => dispatch({ type: "qty", key: l.key, delta: d })} />
                </View>
              </View>
            </View>
            <Divider />
          </Animated.View>
        );
      })}
      <View style={{ marginTop: 16 }}>
        <Totals lines={cart} />
      </View>
    </Screen>
  );
}
