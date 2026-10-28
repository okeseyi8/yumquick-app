import { useRef, useState } from "react";
import { FlatList, View, useWindowDimensions } from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import Animated, { useAnimatedStyle, withTiming } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Icon } from "@/components/icons";
import { Button, Pressy, T, styles } from "@/components/ui";
import { onboarding } from "@/data";
import { color, font, radius } from "@/theme";

function Dot({ on }: { on: boolean }) {
  const anim = useAnimatedStyle(() => ({
    width: withTiming(on ? 24 : 14, { duration: 260 }),
    backgroundColor: on ? color.red : color.cream,
  }));
  return <Animated.View style={[{ height: 4, borderRadius: 2 }, anim]} />;
}

export default function Onboarding() {
  const router = useRouter();
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const list = useRef<FlatList>(null);
  const [page, setPage] = useState(0);
  const last = page === onboarding.length - 1;
  const done = () => router.replace("/welcome");

  return (
    <View style={{ flex: 1, backgroundColor: color.surface }}>
      <FlatList
        ref={list}
        data={onboarding}
        horizontal
        pagingEnabled
        bounces={false}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(i) => i.title}
        onMomentumScrollEnd={(e) => setPage(Math.round(e.nativeEvent.contentOffset.x / width))}
        renderItem={({ item }) => (
          <View style={{ width }}>
            <Image source={item.image} style={{ width, height: height * 0.6 }} contentFit="cover" transition={300} accessibilityIgnoresInvertColors />
          </View>
        )}
      />
      <Pressy
        accessibilityRole="button"
        onPress={done}
        hitSlop={12}
        style={[styles.row, { position: "absolute", top: insets.top + 12, right: 20, backgroundColor: color.surface, borderRadius: radius.pill, paddingHorizontal: 14, height: 32, gap: 2 }]}
      >
        <T v="label" c={color.redText}>
          Skip
        </T>
        <Icon name="chevronRight" size={14} color={color.redText} />
      </Pressy>
      <View style={[styles.sheet, { position: "absolute", left: 0, right: 0, bottom: 0, height: height * 0.42, alignItems: "center", paddingHorizontal: 40, paddingTop: 28, paddingBottom: insets.bottom + 28 }]}>
        <Icon name={onboarding[page].icon} size={44} color={color.red} />
        <T v="title" c={color.redText} style={{ marginTop: 12, fontFamily: font.bold, fontSize: 28 }}>
          {onboarding[page].title}
        </T>
        <T c={color.ink} style={{ textAlign: "center", marginTop: 12, maxWidth: 300 }}>
          {onboarding[page].body}
        </T>
        <View style={[styles.row, { gap: 6, marginTop: "auto", marginBottom: 24 }]} accessibilityLabel={`Page ${page + 1} of ${onboarding.length}`}>
          {onboarding.map((o, i) => (
            <Dot key={o.title} on={i === page} />
          ))}
        </View>
        <Button
          label={last ? "Get Started" : "Next"}
          style={{ minWidth: 160 }}
          onPress={() => {
            if (last) return done();
            list.current?.scrollToIndex({ index: page + 1 });
            setPage(page + 1);
          }}
        />
      </View>
    </View>
  );
}
