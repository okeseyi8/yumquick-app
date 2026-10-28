import { useState } from "react";
import { View } from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import Animated, { FadeIn } from "react-native-reanimated";
import { Icon } from "@/components/icons";
import { Button, Divider, Empty, Screen, Segmented, T, styles } from "@/components/ui";
import { dishById } from "@/data";
import { money, useApp, type Order, type OrderStatus } from "@/store";
import { color, radius } from "@/theme";

const when = (t: number) => new Date(t).toLocaleString("en-US", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" });

function OrderRow({ order }: { order: Order }) {
  const router = useRouter();
  const [, dispatch] = useApp();
  const first = dishById(order.lines[0].dishId)!;
  const count = order.lines.reduce((s, l) => s + l.qty, 0);
  const more = order.lines.length - 1;
  return (
    <View>
      <View style={[styles.row, { gap: 14, paddingVertical: 16, alignItems: "flex-start" }]}>
        <Image source={first.image} style={{ width: 72, height: 96, borderRadius: radius.md }} contentFit="cover" />
        <View style={{ flex: 1 }}>
          <View style={[styles.row, { justifyContent: "space-between", gap: 8, alignItems: "flex-start" }]}>
            <T v="h3" numberOfLines={2} style={{ flex: 1 }}>
              {first.name}
              {more ? ` + ${more} more` : ""}
            </T>
            <T v="h3" c={color.redText}>
              {money(order.total)}
            </T>
          </View>
          <View style={[styles.row, { justifyContent: "space-between", marginTop: 4 }]}>
            <T v="small" c={color.inkSoft}>
              {when(order.placedAt)}
            </T>
            <T v="small" c={color.inkSoft}>
              {count} {count === 1 ? "item" : "items"}
            </T>
          </View>
          {order.status !== "active" ? (
            <View style={[styles.row, { gap: 4, marginTop: 4 }]}>
              <Icon name={order.status === "completed" ? "checkCircle" : "xCircle"} size={13} color={color.redText} />
              <T v="small" c={color.redText}>
                {order.status === "completed" ? "Delivered" : "Cancelled"}
              </T>
            </View>
          ) : null}
          <View style={[styles.row, { gap: 8, marginTop: 10, flexWrap: "wrap" }]}>
            {order.status === "active" ? (
              <>
                <Button label="Cancel order" size="sm" onPress={() => router.push(`/cancel-order/${order.id}`)} />
                <Button label="Track driver" size="sm" tone="soft" onPress={() => router.push(`/delivery-time?id=${order.id}`)} />
              </>
            ) : order.status === "completed" ? (
              <>
                {order.reviewed ? (
                  <T v="small" c={color.inkSoft} style={{ alignSelf: "center", marginRight: 4 }}>
                    Thanks for your review
                  </T>
                ) : (
                  <Button label="Leave a review" size="sm" onPress={() => router.push(`/review/${order.id}`)} />
                )}
                <Button label="Order again" size="sm" tone="soft" onPress={() => dispatch({ type: "reorder", id: order.id })} />
              </>
            ) : null}
          </View>
        </View>
      </View>
      <Divider />
    </View>
  );
}

export default function Orders() {
  const router = useRouter();
  const [{ orders }] = useApp();
  const [tab, setTab] = useState<OrderStatus>("active");
  const list = orders.filter((o) => o.status === tab);
  return (
    <Screen title="My Orders" back={false}>
      <Segmented
        value={tab}
        onChange={setTab}
        options={[
          { value: "active", label: "Active" },
          { value: "completed", label: "Completed" },
          { value: "cancelled", label: "Cancelled" },
        ]}
      />
      <Animated.View key={tab} entering={FadeIn.duration(220)} style={{ marginTop: 8 }}>
        {list.length ? (
          list.map((o) => <OrderRow key={o.id} order={o} />)
        ) : (
          <Empty
            icon="orderSwap"
            title={tab === "active" ? "You don't have any active orders right now" : tab === "completed" ? "No completed orders yet" : "No cancelled orders"}
            action={tab === "active" ? <Button label="Find something to eat" size="sm" onPress={() => router.push("/menu")} /> : undefined}
          />
        )}
      </Animated.View>
    </Screen>
  );
}
