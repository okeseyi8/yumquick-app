import { View } from "react-native";
import { useRouter } from "expo-router";
import { Icon } from "@/components/icons";
import { Divider, Pressy, T, styles } from "@/components/ui";
import { money, totals, useApp, type CartLine } from "@/store";
import { color, radius } from "@/theme";

export function AddressBlock({ editable = true }: { editable?: boolean }) {
  const router = useRouter();
  const [{ addresses, addressId }] = useApp();
  const address = addresses.find((a) => a.id === addressId);
  return (
    <View>
      <View style={[styles.row, { gap: 8, marginBottom: 10 }]}>
        <T v="h2">Shipping Address</T>
        {editable ? (
          <Pressy accessibilityRole="button" accessibilityLabel="Change address" hitSlop={12} onPress={() => router.push("/addresses")}>
            <Icon name="pencil" size={16} color={color.redText} />
          </Pressy>
        ) : null}
      </View>
      <View style={{ backgroundColor: color.cream, borderRadius: radius.md, paddingHorizontal: 16, paddingVertical: 12 }}>
        <T v="label">{address?.label}</T>
        <T v="small" c={color.inkSoft}>
          {address?.line}
        </T>
      </View>
    </View>
  );
}

export function Totals({ lines }: { lines: CartLine[] }) {
  const t = totals(lines);
  const row = (label: string, value: number, strong?: boolean) => (
    <View style={[styles.row, { justifyContent: "space-between", paddingVertical: 5 }]}>
      <T v={strong ? "h2" : "body"}>{label}</T>
      <T v={strong ? "h2" : "body"}>{money(value)}</T>
    </View>
  );
  return (
    <View>
      {row("Subtotal", t.subtotal)}
      {row("Tax and fees", t.tax)}
      {row("Delivery", t.delivery)}
      <Divider style={{ marginVertical: 8 }} />
      {row("Total", t.total, true)}
    </View>
  );
}

export function SectionHead({ title, action, onAction }: { title: string; action?: string; onAction?: () => void }) {
  return (
    <View style={[styles.row, { justifyContent: "space-between", marginTop: 24, marginBottom: 6 }]}>
      <T v="h2">{title}</T>
      {action ? (
        <Pressy accessibilityRole="button" hitSlop={12} onPress={onAction} style={{ backgroundColor: color.blush, borderRadius: radius.pill, paddingHorizontal: 12, paddingVertical: 3 }}>
          <T v="small" c={color.redText}>
            {action}
          </T>
        </Pressy>
      ) : null}
    </View>
  );
}

export const eta = (from = Date.now(), mins = 25) =>
  new Date(from + mins * 60_000).toLocaleString("en-US", { weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
