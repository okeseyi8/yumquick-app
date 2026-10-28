import { useState } from "react";
import { TextInput, View } from "react-native";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Icon } from "@/components/icons";
import { Button, Pressy, Screen, T, styles } from "@/components/ui";
import { dishById } from "@/data";
import { useApp } from "@/store";
import { color, font, radius } from "@/theme";

const LABELS = ["", "Not for me", "Could be better", "Good", "Really good", "Loved it"];

export default function Review() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [{ orders }, dispatch] = useApp();
  const order = orders.find((o) => o.id === id);
  const dish = order ? dishById(order.lines[0].dishId) : undefined;
  const [stars, setStars] = useState(0);
  const [text, setText] = useState("");

  return (
    <Screen
      title="Leave a Review"
      footer={
        <View style={[styles.row, { gap: 12 }]}>
          <Button label="Cancel" tone="soft" style={{ flex: 1 }} onPress={() => router.back()} />
          <Button
            label="Submit"
            disabled={!stars}
            style={{ flex: 1 }}
            onPress={() => {
              dispatch({ type: "reviewed", id });
              router.replace("/orders");
            }}
          />
        </View>
      }
    >
      <View style={{ alignItems: "center" }}>
        {dish ? <Image source={dish.image} style={{ width: 150, height: 150, borderRadius: radius.lg }} contentFit="cover" /> : null}
        <T v="h2" style={{ marginTop: 14 }}>
          {dish?.name}
        </T>
        <T c={color.inkSoft} style={{ textAlign: "center", marginTop: 8, maxWidth: 260 }}>
          We’d love to know what you think of your dish.
        </T>
        <View style={[styles.row, { gap: 8, marginTop: 18 }]} accessibilityRole="radiogroup">
          {[1, 2, 3, 4, 5].map((n) => (
            <Pressy key={n} accessibilityRole="radio" accessibilityState={{ checked: stars === n }} accessibilityLabel={`${n} star${n > 1 ? "s" : ""}`} hitSlop={4} onPress={() => setStars(n)} style={{ padding: 4 }}>
              <Icon name="star" size={34} color={color.red} fill={n <= stars ? color.red : undefined} />
            </Pressy>
          ))}
        </View>
        <T v="label" c={color.redText} style={{ minHeight: 20, marginTop: 6 }}>
          {LABELS[stars]}
        </T>
      </View>
      <T v="h3" style={{ marginTop: 18, marginBottom: 8 }}>
        Leave us a comment
      </T>
      <TextInput
        multiline
        value={text}
        onChangeText={setText}
        placeholder="What did you like? What could be better?"
        placeholderTextColor={color.inkSoft}
        accessibilityLabel="Review comment"
        style={{ minHeight: 110, backgroundColor: color.cream, borderRadius: radius.md, padding: 14, fontFamily: font.regular, fontSize: 16, color: color.ink, textAlignVertical: "top" }}
      />
    </Screen>
  );
}
