import { Switch, View } from "react-native";
import { Divider, Screen, T, styles } from "@/components/ui";
import { useApp } from "@/store";
import { color } from "@/theme";

const ROWS: [string, string][] = [
  ["general", "General notifications"],
  ["sound", "Sound"],
  ["soundCall", "Sound call"],
  ["vibrate", "Vibrate"],
  ["offers", "Special offers"],
  ["payments", "Payments"],
  ["promo", "Promo and discount"],
  ["cashback", "Cashback"],
];

export default function NotificationSettings() {
  const [{ notifications }, dispatch] = useApp();
  return (
    <Screen title="Notifications">
      {ROWS.map(([key, label]) => (
        <View key={key}>
          <View style={[styles.row, { paddingVertical: 12 }]}>
            <T v="h3" style={{ flex: 1 }}>
              {label}
            </T>
            <Switch
              accessibilityLabel={label}
              value={notifications[key]}
              onValueChange={(v) => dispatch({ type: "notify", key, value: v })}
              trackColor={{ true: color.red, false: color.track }}
              thumbColor={color.white}
              // react-native-web only; otherwise the "on" thumb is teal
              {...{ activeThumbColor: color.white }}
              ios_backgroundColor={color.track}
            />
          </View>
          <Divider />
        </View>
      ))}
    </Screen>
  );
}
