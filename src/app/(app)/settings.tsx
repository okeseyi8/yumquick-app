import { Alert, Platform, View } from "react-native";
import { useRouter, type Href } from "expo-router";
import { Icon, type IconName } from "@/components/icons";
import { Divider, Pressy, Screen, T, styles } from "@/components/ui";
import { useApp } from "@/store";
import { color } from "@/theme";

export default function Settings() {
  const router = useRouter();
  const [, dispatch] = useApp();

  const remove = () => {
    const go = () => {
      dispatch({ type: "logout" });
      router.replace("/welcome");
    };
    if (Platform.OS === "web") return globalThis.confirm?.("Delete your account? This can't be undone.") && go();
    Alert.alert("Delete account?", "Your profile, addresses and order history will be removed. This can't be undone.", [
      { text: "Keep account", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: go },
    ]);
  };

  const rows: { label: string; icon: IconName; href?: Href; onPress?: () => void }[] = [
    { label: "Notification Setting", icon: "bell", href: "/settings-notifications" },
    { label: "Password Setting", icon: "key", href: "/settings-password" },
    { label: "Delete Account", icon: "user", onPress: remove },
  ];

  return (
    <Screen title="Settings">
      {rows.map((r) => (
        <Pressy key={r.label} accessibilityRole="button" onPress={r.onPress ?? (() => router.push(r.href!))}>
          <View style={[styles.row, { gap: 16, paddingVertical: 18 }]}>
            <Icon name={r.icon} size={24} color={color.red} />
            <T v="h3" style={{ flex: 1 }}>
              {r.label}
            </T>
            <Icon name="chevronRight" size={16} color={color.redText} />
          </View>
          <Divider />
        </Pressy>
      ))}
    </Screen>
  );
}
