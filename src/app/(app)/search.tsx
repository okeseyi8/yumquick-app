import { useState } from "react";
import { TextInput, View } from "react-native";
import { DishRow } from "@/components/dish-row";
import { Icon } from "@/components/icons";
import { Empty, Screen, styles } from "@/components/ui";
import { dishes } from "@/data";
import { color, font, radius } from "@/theme";

export default function Search() {
  const [q, setQ] = useState("");
  const needle = q.trim().toLowerCase();
  const hits = needle ? dishes.filter((d) => [d.name, d.blurb, ...d.tags].some((s) => s.toLowerCase().includes(needle))) : dishes.slice(0, 6);

  return (
    <Screen title="Search">
      <View style={[styles.row, { backgroundColor: color.cream, borderRadius: radius.pill, paddingHorizontal: 16, gap: 10 }]}>
        <Icon name="search" size={18} color={color.redText} />
        <TextInput
          autoFocus
          value={q}
          onChangeText={setQ}
          placeholder="Dishes, cuisines, ingredients"
          placeholderTextColor={color.inkSoft}
          returnKeyType="search"
          accessibilityLabel="Search dishes"
          style={{ flex: 1, height: 44, fontFamily: font.regular, fontSize: 16, color: color.ink }}
        />
      </View>
      {hits.length ? hits.map((d, i) => <DishRow key={d.id} dish={d} index={i} />) : <Empty icon="search" title={`No dishes match "${q.trim()}"`} body="Check the spelling or try a broader word like pizza or coffee." />}
    </Screen>
  );
}
