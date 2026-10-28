import { useState } from "react";
import { View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Icon } from "@/components/icons";
import { PriceSlider } from "@/components/price-slider";
import { Button, CategoryRow, Chip, Divider, Pressy, Screen, T, styles } from "@/components/ui";
import { dishes, type CategoryId } from "@/data";
import { color } from "@/theme";

export default function Filter() {
  const router = useRouter();
  const p = useLocalSearchParams<{ cat?: CategoryId }>();
  const [cat, setCat] = useState<CategoryId>(p.cat ?? "snacks");
  const [rating, setRating] = useState(0);
  const [tags, setTags] = useState<string[]>([]);
  const [max, setMax] = useState(100);
  const available = [...new Set(dishes.filter((d) => d.category === cat).flatMap((d) => d.tags))];

  return (
    <Screen
      title="Filter"
      footer={
        <Button
          label="Apply"
          size="lg"
          style={{ alignSelf: "center", minWidth: 180 }}
          onPress={() =>
            router.navigate({
              pathname: "/menu",
              params: { cat, ...(max < 100 ? { max: String(max) } : {}), ...(rating ? { rating: String(rating) } : {}), ...(tags.length ? { tags: tags.join(",") } : {}) },
            })
          }
        />
      }
    >
      <T v="h2" style={{ marginBottom: 14 }}>
        Categories
      </T>
      <CategoryRow
        active={cat}
        onSelect={(c) => {
          setCat(c);
          setTags([]);
        }}
      />
      <Divider style={{ marginVertical: 18 }} />
      <T v="h2">Minimum rating</T>
      <View style={[styles.row, { gap: 6, marginTop: 10 }]} accessibilityRole="radiogroup">
        {[1, 2, 3, 4, 5].map((n) => (
          <Pressy key={n} accessibilityRole="radio" accessibilityState={{ checked: rating === n }} accessibilityLabel={`${n} stars and up`} hitSlop={6} onPress={() => setRating(rating === n ? 0 : n)} style={{ padding: 4 }}>
            <Icon name="star" size={26} color={color.red} fill={n <= rating ? color.red : undefined} />
          </Pressy>
        ))}
        <T v="small" c={color.inkSoft} style={{ marginLeft: 8 }}>
          {rating ? `${rating}+ stars` : "Any rating"}
        </T>
      </View>
      <Divider style={{ marginVertical: 18 }} />
      <T v="h2" style={{ marginBottom: 12 }}>
        Dish type
      </T>
      <View style={[styles.row, { flexWrap: "wrap", gap: 8 }]}>
        {available.map((t) => (
          <Chip key={t} label={t} on={tags.includes(t)} onPress={() => setTags(tags.includes(t) ? tags.filter((x) => x !== t) : [...tags, t])} />
        ))}
      </View>
      <Divider style={{ marginVertical: 18 }} />
      <T v="h2" c={color.redText} style={{ marginBottom: 8 }}>
        Price
      </T>
      <PriceSlider value={max} onChange={setMax} />
    </Screen>
  );
}
