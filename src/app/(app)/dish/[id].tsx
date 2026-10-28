import { useState } from "react";
import { View } from "react-native";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Icon } from "@/components/icons";
import { Button, Divider, Empty, IconButton, Pressy, Rating, Screen, Stepper, T, styles } from "@/components/ui";
import { dishById } from "@/data";
import { money, unitPrice, useApp } from "@/store";
import { color, radius } from "@/theme";

function Check({ on }: { on: boolean }) {
  return (
    <View style={[styles.center, { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: color.red, backgroundColor: on ? color.red : "transparent" }]}>
      {on ? <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: color.white }} /> : null}
    </View>
  );
}

export default function DishScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [{ favorites }, dispatch] = useApp();
  const dish = dishById(id);
  const [qty, setQty] = useState(1);
  const [addOns, setAddOns] = useState<string[]>([]);

  if (!dish) {
    return (
      <Screen title="Not found">
        <Empty icon="search" title="We couldn't find that dish" action={<Button label="Back to menu" size="sm" onPress={() => router.replace("/menu")} />} />
      </Screen>
    );
  }

  const fav = favorites.includes(dish.id);
  const unit = unitPrice(dish.id, addOns);

  return (
    <Screen
      header={
        <View style={[styles.row, { gap: 12 }]}>
          <IconButton name="chevronLeft" label="Back" onPress={() => router.back()} />
          <View style={{ flex: 1 }}>
            <T v="h2" accessibilityRole="header" numberOfLines={1}>
              {dish.name}
            </T>
            <View style={{ alignSelf: "flex-start", marginTop: 4 }}>
              <Rating value={dish.rating} />
            </View>
          </View>
          <IconButton
            name="heart"
            label={fav ? "Remove from favorites" : "Save to favorites"}
            tone="red"
            filled={fav}
            onPress={() => dispatch({ type: "toggleFavorite", dishId: dish.id })}
          />
        </View>
      }
      footer={
        <Button
          label={`Add to Cart · ${money(unit * qty)}`}
          icon="cart"
          size="lg"
          onPress={() => {
            dispatch({ type: "add", dishId: dish.id, qty, addOns });
            dispatch({ type: "drawer", drawer: "cart" });
            setQty(1);
            setAddOns([]);
          }}
        />
      }
    >
      <Image source={dish.image} style={{ width: "100%", aspectRatio: 1.45, borderRadius: radius.lg }} contentFit="cover" transition={250} />
      <View style={[styles.row, { justifyContent: "space-between", marginTop: 16 }]}>
        <T v="title" c={color.redText}>
          {money(dish.price)}
        </T>
        <Stepper qty={qty} onChange={(d) => setQty(qty + d)} />
      </View>
      <Divider style={{ marginVertical: 14 }} />
      <T v="h3">{dish.blurb}</T>
      <T c={color.inkSoft} style={{ marginTop: 6 }}>
        {dish.description}
      </T>
      <T v="h2" style={{ marginTop: 22, marginBottom: 6 }}>
        {dish.addOnsTitle}
      </T>
      {dish.addOns.map((a) => {
        const on = addOns.includes(a.id);
        return (
          <Pressy
            key={a.id}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: on }}
            accessibilityLabel={`${a.name}, ${a.price ? `plus ${money(a.price)}` : "free"}`}
            onPress={() => setAddOns(on ? addOns.filter((x) => x !== a.id) : [...addOns, a.id])}
            style={[styles.row, { paddingVertical: 10, gap: 12 }]}
          >
            <T style={{ flex: 1 }}>{a.name}</T>
            <T c={color.inkSoft}>{a.price ? `+${money(a.price)}` : "Free"}</T>
            <Check on={on} />
          </Pressy>
        );
      })}
      <View style={[styles.row, { gap: 6, marginTop: 14 }]}>
        <Icon name="clock" size={16} color={color.inkSoft} />
        <T v="small" c={color.inkSoft}>
          Ready in about 20 minutes
        </T>
      </View>
    </Screen>
  );
}
