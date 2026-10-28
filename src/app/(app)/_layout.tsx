import { View } from "react-native";
import { Redirect, useRouter, type Href } from "expo-router";
import { Tabs, type BottomTabBarProps } from "expo-router/js-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Drawers } from "@/components/drawers";
import { Icon, type IconName } from "@/components/icons";
import { Pressy, styles } from "@/components/ui";
import { useApp } from "@/store";
import { color } from "@/theme";

const TABS: { name: string; href: Href; icon: IconName; label: string }[] = [
  { name: "home", href: "/home", icon: "home", label: "Home" },
  { name: "menu", href: "/menu", icon: "cloche", label: "Menu" },
  { name: "favorites", href: "/favorites", icon: "heart", label: "Favorites" },
  { name: "orders", href: "/orders", icon: "clipboard", label: "My orders" },
  { name: "support", href: "/support", icon: "headset", label: "Help and support" },
];

const SECTION: Record<string, string> = {
  "dish/[id]": "menu",
  filter: "menu",
  search: "menu",
  "cancel-order/[id]": "orders",
  "order-cancelled": "orders",
  "review/[id]": "orders",
  "order-confirmed": "orders",
  "delivery-time": "orders",
};

// Full-yellow screens: the tab bar's rounded corners should sit on yellow, not the sheet color.
const YELLOW = new Set(["order-confirmed", "order-cancelled"]);

// Not shown in the custom tab bar, but must be tabs so the bar stays visible on them.
const HIDDEN = [
  "dish/[id]",
  "filter",
  "search",
  "confirm-order",
  "payment",
  "order-confirmed",
  "delivery-time",
  "cancel-order/[id]",
  "order-cancelled",
  "review/[id]",
  "profile",
  "addresses",
  "address-new",
  "payment-methods",
  "card-new",
  "settings",
  "settings-notifications",
  "settings-password",
];

function TabBar({ state }: BottomTabBarProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const current = state.routes[state.index].name;
  const active = SECTION[current] ?? current;
  return (
    <View style={{ backgroundColor: YELLOW.has(current) ? color.yellow : color.surface }}>
      <View
        accessibilityRole="tablist"
        style={[styles.row, { backgroundColor: color.red, borderTopLeftRadius: 30, borderTopRightRadius: 30, paddingTop: 14, paddingBottom: Math.max(insets.bottom, 14), justifyContent: "space-around" }]}
      >
        {TABS.map((t) => {
          const on = t.name === active;
          return (
            <Pressy
              key={t.name}
              accessibilityRole="tab"
              accessibilityLabel={t.label}
              accessibilityState={{ selected: on }}
              onPress={() => router.navigate(t.href)}
              style={[styles.center, { width: 52, height: 44, gap: 4 }]}
            >
              <Icon name={t.icon} size={28} color={on ? color.yellow : color.white} />
              <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: on ? color.yellow : "transparent" }} />
            </Pressy>
          );
        })}
      </View>
    </View>
  );
}

export default function AppLayout() {
  const [{ user }] = useApp();
  if (!user) return <Redirect href="/welcome" />;
  return (
    <View style={{ flex: 1 }}>
      <Tabs backBehavior="history" tabBar={(p) => <TabBar {...p} />} screenOptions={{ headerShown: false, sceneStyle: { backgroundColor: color.yellow } }}>
        {TABS.map((t) => (
          <Tabs.Screen key={t.name} name={t.name} options={{ title: t.label }} />
        ))}
        {HIDDEN.map((name) => (
          <Tabs.Screen key={name} name={name} />
        ))}
      </Tabs>
      <Drawers />
    </View>
  );
}
