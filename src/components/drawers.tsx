import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import { useRouter, type Href } from "expo-router";
import Animated, { Easing, FadeIn, FadeOut, SlideInRight, SlideOutRight } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Icon, type IconName } from "@/components/icons";
import { Button, Divider, Pressy, styles } from "@/components/ui";
import { dishById } from "@/data";
import { money, totals, useApp } from "@/store";
import { color, font } from "@/theme";

const out = Easing.bezier(0.22, 1, 0.36, 1);
const white60 = "rgba(255,255,255,0.35)";

export function Drawers() {
  const [{ drawer }, dispatch] = useApp();
  const insets = useSafeAreaInsets();
  if (!drawer) return null;
  const close = () => dispatch({ type: "drawer", drawer: null });
  return (
    <View style={StyleSheet.absoluteFill} accessibilityViewIsModal>
      <Animated.View entering={FadeIn.duration(200)} exiting={FadeOut.duration(200)} style={[StyleSheet.absoluteFill, { backgroundColor: "rgba(57,23,19,0.35)" }]}>
        <Pressable style={{ flex: 1 }} onPress={close} accessibilityRole="button" accessibilityLabel="Close" />
      </Animated.View>
      <Animated.View
        entering={SlideInRight.duration(380).easing(out)}
        exiting={SlideOutRight.duration(240).easing(Easing.in(Easing.quad))}
        style={[s.panel, { paddingTop: insets.top + 24, paddingBottom: insets.bottom + 24 }]}
      >
        {drawer === "cart" ? <Cart close={close} /> : <Profile close={close} />}
      </Animated.View>
    </View>
  );
}

function Cart({ close }: { close: () => void }) {
  const router = useRouter();
  const [{ cart }, dispatch] = useApp();
  const t = totals(cart);
  return (
    <View style={{ flex: 1 }}>
      <View style={[styles.row, { gap: 10, justifyContent: "center" }]}>
        <View style={[styles.center, s.iconTile]}>
          <Icon name="cart" size={20} color={color.red} />
        </View>
        <Text style={s.heading} accessibilityRole="header">
          Cart
        </Text>
      </View>
      <Divider style={{ backgroundColor: white60, marginVertical: 18 }} />
      {cart.length === 0 ? (
        <View style={{ flex: 1, alignItems: "center" }}>
          <Text style={s.body}>Your cart is empty</Text>
          <Pressy
            accessibilityRole="button"
            accessibilityLabel="Browse the menu"
            onPress={() => {
              close();
              router.push("/menu");
            }}
            style={[styles.center, { marginTop: "auto", marginBottom: "auto" }]}
          >
            <View style={[styles.center, { width: 96, height: 96, borderRadius: 48, borderWidth: 3, borderColor: color.white }]}>
              <Icon name="plus" size={48} color={color.white} />
            </View>
            <Text style={[s.heading, { marginTop: 24, textAlign: "center", fontSize: 22 }]}>Want to add{"\n"}something?</Text>
          </Pressy>
        </View>
      ) : (
        <>
          <Text style={s.body}>
            You have {t.count} {t.count === 1 ? "item" : "items"} in the cart
          </Text>
          <ScrollView style={{ flex: 1, marginTop: 12 }} showsVerticalScrollIndicator={false}>
            {cart.map((l) => {
              const dish = dishById(l.dishId)!;
              return (
                <View key={l.key}>
                  <View style={[styles.row, { gap: 12, paddingVertical: 12 }]}>
                    <Image source={dish.image} style={{ width: 64, height: 64, borderRadius: 14 }} contentFit="cover" />
                    <View style={{ flex: 1 }}>
                      <Text style={[s.body, { fontFamily: font.semibold }]} numberOfLines={2}>
                        {dish.name}
                      </Text>
                      <Text style={[s.small, { marginTop: 2 }]}>{money(l.unit)}</Text>
                      {l.addOns.length ? (
                        <Text style={s.small} numberOfLines={1}>
                          + {dish.addOns.filter((a) => l.addOns.includes(a.id)).map((a) => a.name).join(", ")}
                        </Text>
                      ) : null}
                    </View>
                    <View style={{ alignItems: "flex-end", gap: 8 }}>
                      <Pressy accessibilityRole="button" accessibilityLabel={`Remove ${dish.name}`} hitSlop={10} onPress={() => dispatch({ type: "remove", key: l.key })}>
                        <Icon name="trash" size={16} color={color.white} />
                      </Pressy>
                      <View style={[styles.row, { gap: 8 }]}>
                        <Pressy accessibilityRole="button" accessibilityLabel="Decrease quantity" hitSlop={10} onPress={() => dispatch({ type: "qty", key: l.key, delta: -1 })} style={s.stepBtn}>
                          <Icon name="minus" size={12} color={color.red} />
                        </Pressy>
                        <Text style={[s.body, { minWidth: 14, textAlign: "center" }]}>{l.qty}</Text>
                        <Pressy accessibilityRole="button" accessibilityLabel="Increase quantity" hitSlop={10} onPress={() => dispatch({ type: "qty", key: l.key, delta: 1 })} style={s.stepBtn}>
                          <Icon name="plus" size={12} color={color.red} />
                        </Pressy>
                      </View>
                    </View>
                  </View>
                  <Divider style={{ backgroundColor: white60 }} />
                </View>
              );
            })}
            <View style={{ gap: 8, marginTop: 20 }}>
              <Line label="Subtotal" value={money(t.subtotal)} />
              <Line label="Tax and fees" value={money(t.tax)} />
              <Line label="Delivery" value={money(t.delivery)} />
              <Divider style={{ backgroundColor: white60, marginVertical: 6 }} />
              <Line label="Total" value={money(t.total)} strong />
            </View>
          </ScrollView>
          <Button
            label="Checkout"
            tone="yellow"
            style={{ alignSelf: "center", marginTop: 16, minWidth: 180 }}
            onPress={() => {
              close();
              router.push("/confirm-order");
            }}
          />
        </>
      )}
    </View>
  );
}

function Line({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  const st = [s.body, strong && { fontFamily: font.bold, fontSize: 19 }];
  return (
    <View style={[styles.row, { justifyContent: "space-between" }]}>
      <Text style={st}>{label}</Text>
      <Text style={st}>{value}</Text>
    </View>
  );
}

const links: { label: string; icon: IconName; href: Href }[] = [
  { label: "My Orders", icon: "bag", href: "/orders" },
  { label: "My Profile", icon: "user", href: "/profile" },
  { label: "Delivery Address", icon: "pin", href: "/addresses" },
  { label: "Payment Methods", icon: "card", href: "/payment-methods" },
  { label: "Contact Us", icon: "phone", href: "/support?tab=contact" },
  { label: "Help & FAQs", icon: "chat", href: "/support" },
  { label: "Settings", icon: "gear", href: "/settings" },
];

function Profile({ close }: { close: () => void }) {
  const router = useRouter();
  const [{ user }, dispatch] = useApp();
  const initials = (user?.name ?? "Guest").split(" ").map((p) => p[0]).slice(0, 2).join("");
  return (
    <View style={{ flex: 1 }}>
      <View style={[styles.row, { gap: 14 }]}>
        <View style={[styles.center, { width: 56, height: 56, borderRadius: 18, backgroundColor: color.yellow }]}>
          <Text style={{ fontFamily: font.bold, fontSize: 22, color: color.redDeep }}>{initials}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={s.heading} numberOfLines={1}>
            {user?.name ?? "Guest"}
          </Text>
          <Text style={s.small} numberOfLines={1}>
            {user?.email}
          </Text>
        </View>
      </View>
      <ScrollView style={{ marginTop: 28 }} showsVerticalScrollIndicator={false}>
        {links.map((l) => (
          <Pressy
            key={l.label}
            accessibilityRole="link"
            onPress={() => {
              close();
              router.push(l.href);
            }}
          >
            <View style={[styles.row, { gap: 16, paddingVertical: 12 }]}>
              <View style={[styles.center, s.iconTile]}>
                <Icon name={l.icon} size={20} color={color.red} />
              </View>
              <Text style={[s.body, { fontSize: 18 }]}>{l.label}</Text>
            </View>
            <Divider style={{ backgroundColor: white60, marginLeft: 56 }} />
          </Pressy>
        ))}
      </ScrollView>
      <Pressy
        accessibilityRole="button"
        onPress={() => {
          dispatch({ type: "logout" });
          router.replace("/welcome");
        }}
        style={[styles.row, { gap: 16, paddingVertical: 12 }]}
      >
        <View style={[styles.center, s.iconTile]}>
          <Icon name="logout" size={20} color={color.red} />
        </View>
        <Text style={[s.body, { fontSize: 18 }]}>Log Out</Text>
      </Pressy>
    </View>
  );
}

const s = StyleSheet.create({
  panel: { position: "absolute", top: 0, bottom: 0, right: 0, width: "84%", maxWidth: 380, backgroundColor: color.red, borderTopLeftRadius: 40, borderBottomLeftRadius: 40, paddingHorizontal: 28 },
  heading: { fontFamily: font.bold, fontSize: 26, color: color.white },
  body: { fontFamily: font.regular, fontSize: 16, color: color.white },
  small: { fontFamily: font.regular, fontSize: 13, color: "rgba(255,255,255,0.85)" },
  iconTile: { width: 40, height: 40, borderRadius: 12, backgroundColor: color.white },
  stepBtn: { width: 20, height: 20, borderRadius: 10, backgroundColor: color.white, alignItems: "center", justifyContent: "center" },
});
