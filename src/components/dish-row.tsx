import { View } from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import Animated, { FadeInDown } from "react-native-reanimated";
import { Divider, Pressy, Rating, T, styles } from "@/components/ui";
import type { Dish } from "@/data";
import { money } from "@/store";
import { color, radius } from "@/theme";

export function DishRow({ dish, index = 0 }: { dish: Dish; index?: number }) {
  const router = useRouter();
  return (
    <Animated.View entering={FadeInDown.duration(380).delay(Math.min(index, 5) * 50)}>
      <Pressy accessibilityRole="button" accessibilityLabel={`${dish.name}, ${money(dish.price)}, rated ${dish.rating}`} onPress={() => router.push(`/dish/${dish.id}`)} style={{ paddingVertical: 16 }}>
        <Image source={dish.image} style={{ width: "100%", aspectRatio: 1.85, borderRadius: radius.lg }} contentFit="cover" transition={200} />
        <View style={[styles.row, { marginTop: 10, gap: 8 }]}>
          <T v="h2" numberOfLines={1} style={{ flexShrink: 1 }}>
            {dish.name}
          </T>
          <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: color.red }} />
          <Rating value={dish.rating} />
          <T v="h3" c={color.redText} style={{ marginLeft: "auto" }}>
            {money(dish.price)}
          </T>
        </View>
        <T v="small" c={color.inkSoft} style={{ marginTop: 4, maxWidth: "85%" }} numberOfLines={3}>
          {dish.description}
        </T>
      </Pressy>
      <Divider />
    </Animated.View>
  );
}
