import { FlatList, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { DishRow } from "@/components/dish-row";
import { Icon } from "@/components/icons";
import { Empty, Pressy, T, TopBar, Button, styles } from "@/components/ui";
import { categories, dishes, type CategoryId } from "@/data";
import { color, radius } from "@/theme";

export default function Menu() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const p = useLocalSearchParams<{ cat?: CategoryId; max?: string; rating?: string; tags?: string }>();
  const cat = p.cat ?? "snacks";
  const max = p.max ? Number(p.max) : undefined;
  const minRating = p.rating ? Number(p.rating) : 0;
  const tags = p.tags ? p.tags.split(",") : [];
  const filtered = Boolean(max || minRating || tags.length);

  const list = dishes
    .filter((d) => d.category === cat && (!max || d.price <= max) && d.rating >= minRating && (!tags.length || d.tags.some((t) => tags.includes(t))))
    .sort((a, b) => b.rating - a.rating);

  return (
    <View style={{ flex: 1, backgroundColor: color.yellow }}>
      <View style={{ paddingTop: insets.top + 12, paddingHorizontal: 24, paddingBottom: 18 }}>
        <TopBar />
      </View>
      <View style={{ backgroundColor: color.red, borderTopLeftRadius: radius.sheet, borderTopRightRadius: radius.sheet, paddingTop: 14, paddingHorizontal: 12 }}>
        <View style={[styles.row, { justifyContent: "space-between" }]} accessibilityRole="tablist">
          {categories.map((c) => {
            const on = c.id === cat;
            return (
              <Pressy
                key={c.id}
                accessibilityRole="tab"
                accessibilityState={{ selected: on }}
                accessibilityLabel={c.label}
                onPress={() => router.setParams({ cat: c.id, max: undefined, rating: undefined, tags: undefined })}
                style={{ alignItems: "center", paddingTop: 8, paddingBottom: 10, paddingHorizontal: 6, borderTopLeftRadius: 26, borderTopRightRadius: 26, backgroundColor: on ? color.surface : "transparent" }}
              >
                <View style={[styles.center, { width: 52, height: 62, borderRadius: 26, backgroundColor: on ? color.yellow : color.cream }]}>
                  <Icon name={c.icon} size={32} color={color.red} />
                </View>
                <T v="small" c={on ? color.ink : color.white} style={{ marginTop: 4 }}>
                  {c.label}
                </T>
              </Pressy>
            );
          })}
        </View>
      </View>
      <View style={{ flex: 1, backgroundColor: color.surface }}>
        <FlatList
          data={list}
          keyExtractor={(d) => d.id}
          contentContainerStyle={{ paddingHorizontal: 28, paddingBottom: 32 }}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View style={[styles.row, { justifyContent: "space-between", paddingTop: 18 }]}>
              <T v="small">
                Sort by <T v="small" c={color.redText}>{filtered ? "Your filters" : "Top rated"}</T>
              </T>
              <Pressy accessibilityRole="button" accessibilityLabel="Filter" hitSlop={10} onPress={() => router.push({ pathname: "/filter", params: { cat } })} style={[styles.center, { width: 28, height: 28, borderRadius: 14, backgroundColor: color.red }]}>
                <Icon name="sliders" size={16} color={color.white} />
              </Pressy>
            </View>
          }
          renderItem={({ item, index }) => <DishRow dish={item} index={index} />}
          ListEmptyComponent={
            <Empty
              icon="search"
              title="Nothing matches those filters"
              body="Try a higher price limit or fewer dish types."
              action={<Button label="Clear filters" tone="soft" size="sm" onPress={() => router.setParams({ max: undefined, rating: undefined, tags: undefined })} />}
            />
          }
        />
      </View>
    </View>
  );
}
