import { useEffect, useRef, useState } from "react";
import { FlatList, ScrollView, View, useWindowDimensions } from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import Animated, { useAnimatedStyle, useReducedMotion, withTiming } from "react-native-reanimated";
import { Icon } from "@/components/icons";
import { CategoryRow, Divider, PriceTag, Pressy, Rating, Screen, T, TopBar, styles } from "@/components/ui";
import { bestSellers, dishById, promos, recommended } from "@/data";
import { money, useApp } from "@/store";
import { color, font, radius } from "@/theme";

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return ["Good Morning", "Rise and shine! It's breakfast time"];
  if (h < 17) return ["Good Afternoon", "Lunch is a few taps away"];
  return ["Good Evening", "Dinner's on us to deliver"];
}

function Dot({ on }: { on: boolean }) {
  const a = useAnimatedStyle(() => ({ width: withTiming(on ? 28 : 20, { duration: 260 }), backgroundColor: on ? color.red : color.cream }));
  return <Animated.View style={[{ height: 4, borderRadius: 2 }, a]} />;
}

function Promos() {
  const router = useRouter();
  const reduce = useReducedMotion();
  const { width } = useWindowDimensions();
  const w = Math.min(width, 600) - 56;
  const ref = useRef<FlatList>(null);
  const [i, setI] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const t = setInterval(() => {
      const next = (i + 1) % promos.length;
      ref.current?.scrollToIndex({ index: next, animated: true });
      setI(next);
    }, 4500);
    return () => clearInterval(t);
  }, [i, reduce]);

  return (
    <View style={{ marginTop: 24 }}>
      <FlatList
        ref={ref}
        data={promos}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        getItemLayout={(_, index) => ({ length: w, offset: w * index, index })}
        onMomentumScrollEnd={(e) => setI(Math.round(e.nativeEvent.contentOffset.x / w))}
        style={{ width: w, borderRadius: radius.lg }}
        keyExtractor={(p) => p.id}
        renderItem={({ item }) => (
          <Pressy accessibilityRole="button" accessibilityLabel={`${item.headline}. ${item.line}`} onPress={() => router.push(`/dish/${item.dish}`)} style={[styles.row, { width: w, height: 150, backgroundColor: color.red }]}>
            <View style={{ flex: 1, paddingHorizontal: 18, overflow: "hidden", alignSelf: "stretch", justifyContent: "center" }}>
              <View style={{ position: "absolute", width: 70, height: 70, borderRadius: 35, borderWidth: 9, borderColor: color.yellow, left: -30, bottom: -30 }} />
              <View style={{ position: "absolute", width: 64, height: 64, borderRadius: 32, borderWidth: 8, borderColor: color.yellow, right: -6, top: -40 }} />
              <T c={color.white} style={{ textAlign: "center", fontSize: 16 }}>
                {item.line}
              </T>
              <T c={color.white} style={{ textAlign: "center", fontFamily: font.bold, fontSize: item.headline.length > 8 ? 26 : 32, lineHeight: item.headline.length > 8 ? 30 : 38, marginTop: 6 }}>
                {item.headline}
              </T>
            </View>
            <Image source={item.image} style={{ flex: 1.1, alignSelf: "stretch" }} contentFit="cover" transition={200} />
          </Pressy>
        )}
      />
      <View style={[styles.row, { gap: 6, justifyContent: "center", marginTop: 10 }]}>
        {promos.map((p, k) => (
          <Dot key={p.id} on={k === i} />
        ))}
      </View>
    </View>
  );
}

export default function Home() {
  const router = useRouter();
  const [{ favorites }, dispatch] = useApp();
  const [hello, sub] = greeting();

  return (
    <Screen
      header={
        <View>
          <TopBar />
          <T v="display" accessibilityRole="header" style={{ marginTop: 22 }}>
            {hello}
          </T>
          <T v="label" c={color.redDeep} style={{ marginTop: 2 }}>
            {sub}
          </T>
        </View>
      }
    >
      <CategoryRow onSelect={(cat) => router.push({ pathname: "/menu", params: { cat } })} />
      <Divider style={{ marginTop: 16, marginBottom: 18 }} />

      <View style={[styles.row, { justifyContent: "space-between" }]}>
        <T v="h2" accessibilityRole="header">
          Best Seller
        </T>
        <Pressy accessibilityRole="link" hitSlop={12} onPress={() => router.push("/menu")} style={[styles.row, { gap: 4 }]}>
          <T v="label" c={color.redText}>
            View all
          </T>
          <Icon name="chevronRight" size={14} color={color.redText} />
        </Pressy>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 12, marginHorizontal: -28 }} contentContainerStyle={{ paddingHorizontal: 28, gap: 10 }}>
        {bestSellers.map((id) => {
          const dish = dishById(id)!;
          return (
            <Pressy key={id} accessibilityRole="button" accessibilityLabel={`${dish.name}, ${money(dish.price)}`} onPress={() => router.push(`/dish/${id}`)}>
              <Image source={dish.image} style={{ width: 76, height: 110, borderRadius: radius.lg }} contentFit="cover" transition={200} />
              <PriceTag value={money(dish.price)} />
            </Pressy>
          );
        })}
      </ScrollView>

      <Promos />

      <T v="h2" accessibilityRole="header" style={{ marginTop: 24, marginBottom: 12 }}>
        Recommended
      </T>
      <View style={[styles.row, { flexWrap: "wrap", gap: 12 }]}>
        {recommended.map((id) => {
          const dish = dishById(id)!;
          const fav = favorites.includes(id);
          return (
            <View key={id} style={{ flexBasis: "47%", flexGrow: 1 }}>
              <Pressy accessibilityRole="button" accessibilityLabel={`${dish.name}, ${money(dish.price)}`} onPress={() => router.push(`/dish/${id}`)}>
                <View>
                  <Image source={dish.image} style={{ width: "100%", aspectRatio: 1.15, borderRadius: radius.lg }} contentFit="cover" transition={200} />
                  <PriceTag value={money(dish.price)} />
                </View>
                <T v="label" style={{ marginTop: 6 }} numberOfLines={1}>
                  {dish.name}
                </T>
              </Pressy>
              <View style={[styles.row, { position: "absolute", top: 8, left: 8, gap: 6 }]}>
                <Rating value={dish.rating} />
                <Pressy
                  accessibilityRole="button"
                  accessibilityLabel={fav ? `Remove ${dish.name} from favorites` : `Save ${dish.name} to favorites`}
                  hitSlop={10}
                  onPress={() => dispatch({ type: "toggleFavorite", dishId: id })}
                  style={[styles.center, { width: 22, height: 22, borderRadius: 11, backgroundColor: color.white }]}
                >
                  <Icon name="heart" size={14} color={color.red} fill={fav ? color.red : undefined} />
                </Pressy>
              </View>
            </View>
          );
        })}
      </View>
    </Screen>
  );
}
