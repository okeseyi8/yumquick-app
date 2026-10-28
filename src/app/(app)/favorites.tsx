import { View } from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import Animated, { FadeOut, LinearTransition } from "react-native-reanimated";
import { Icon } from "@/components/icons";
import { Button, Empty, PriceTag, Pressy, Screen, T, styles } from "@/components/ui";
import { dishById } from "@/data";
import { money, useApp } from "@/store";
import { color, radius } from "@/theme";

export default function Favorites() {
  const router = useRouter();
  const [{ favorites }, dispatch] = useApp();
  return (
    <Screen title="Favorites" subtitle="Dishes you keep coming back to" back={false}>
      {favorites.length === 0 ? (
        <Empty icon="heart" title="No favorites yet" body="Tap the heart on any dish to keep it here." action={<Button label="Browse the menu" size="sm" onPress={() => router.push("/menu")} />} />
      ) : (
        <View style={[styles.row, { flexWrap: "wrap", gap: 14 }]}>
          {favorites.map((id) => {
            const dish = dishById(id)!;
            return (
              <Animated.View key={id} exiting={FadeOut.duration(180)} layout={LinearTransition.duration(260)} style={{ flexBasis: "46%", flexGrow: 1 }}>
                <Pressy accessibilityRole="button" accessibilityLabel={dish.name} onPress={() => router.push(`/dish/${id}`)}>
                  <View>
                    <Image source={dish.image} style={{ width: "100%", aspectRatio: 1, borderRadius: radius.lg }} contentFit="cover" transition={200} />
                    <PriceTag value={money(dish.price)} />
                  </View>
                  <T v="label" numberOfLines={1} style={{ marginTop: 8 }}>
                    {dish.name}
                  </T>
                  <T v="small" c={color.inkSoft} numberOfLines={1}>
                    {dish.blurb}
                  </T>
                </Pressy>
                <Pressy
                  accessibilityRole="button"
                  accessibilityLabel={`Remove ${dish.name} from favorites`}
                  hitSlop={10}
                  onPress={() => dispatch({ type: "toggleFavorite", dishId: id })}
                  style={[styles.center, { position: "absolute", top: 8, right: 8, width: 28, height: 28, borderRadius: 14, backgroundColor: color.white }]}
                >
                  <Icon name="heart" size={16} color={color.red} fill={color.red} />
                </Pressy>
              </Animated.View>
            );
          })}
        </View>
      )}
    </Screen>
  );
}
