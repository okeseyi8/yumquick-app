import { View } from "react-native";
import { useRouter } from "expo-router";
import { Icon } from "@/components/icons";
import { Button, Divider, Pressy, Radio, Screen, T, styles } from "@/components/ui";
import { useApp } from "@/store";
import { color } from "@/theme";

export default function Addresses() {
  const router = useRouter();
  const [{ addresses, addressId }, dispatch] = useApp();
  return (
    <Screen title="Delivery Address" footer={<Button label="Add New Address" tone="soft" style={{ alignSelf: "center" }} onPress={() => router.push("/address-new")} />}>
      {addresses.map((a) => (
        <Pressy key={a.id} accessibilityRole="radio" accessibilityState={{ checked: a.id === addressId }} onPress={() => dispatch({ type: "selectAddress", id: a.id })}>
          <View style={[styles.row, { gap: 14, paddingVertical: 16 }]}>
            <Icon name="home" size={26} color={color.red} />
            <View style={{ flex: 1 }}>
              <T v="h3">{a.label}</T>
              <T v="small" c={color.inkSoft}>
                {a.line}
              </T>
            </View>
            <Radio on={a.id === addressId} />
          </View>
          <Divider />
        </Pressy>
      ))}
    </Screen>
  );
}
